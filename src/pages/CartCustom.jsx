import React, { useRef, useEffect, useState } from 'react';
import { Accordion } from 'react-bootstrap';
import { Navbar, Footer } from "../components";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItem } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";
import "../assets/css/cartcustom.css";

const CartCustom = () => {
    const { t } = useTranslation();
    const canvasRef = useRef(null);

    // --- STATE CONFIGURATION ---
    const [mode, setMode] = useState('tracksuit'); // tracksuit, shirt, pant
    
    // Design Configuration
    const [designPattern, setDesignPattern] = useState('single_stripe'); // none, single_stripe, triple_stripe, side_panel, chest_block
    // Wizard State
    const [step, setStep] = useState(1);

    const handleNextStep = () => {
        // Validation for Step 1 could go here (e.g. check if colors are selected, usually they are defaults)
        setStep(2);
    };

    // --- RESTORED STATE & LOGIC ---
    const [fit, setFit] = useState('regular'); // slim, regular, loose
    
    // Colors
    const [mainColor, setMainColor] = useState('#1a237e');
    const [accentColor, setAccentColor] = useState('#ffffff');
    const [zipperColor, setZipperColor] = useState('#cfd8dc');

    // Toggle Features
    const [hasHood, setHasHood] = useState(true);
    const [hasZipper, setHasZipper] = useState(true);
    const [logoVisible, setLogoVisible] = useState(true);

    // Measurements (cm)
    const [measurements, setMeasurements] = useState({
        shoulder: 45,
        chest: 100,
        waist: 85,
        hips: 100,
        armLength: 60,
        inseam: 75,
        neck: 40,
        topLength: 70,
        thigh: 55,
        ankle: 30,
        sleeveWidth: 35
    });

    // View State
    const [view, setView] = useState('front'); // front, back, side

    // Handle Measurement Change
    const setMsmt = (key, val) => {
        setMeasurements(prev => ({ ...prev, [key]: Number(val) }));
    };

    // --- DRAWING ENGINE ---
    useEffect(() => {
        drawRealisticDesign();
        // eslint-disable-next-line
    }, [mode, designPattern, fit, mainColor, accentColor, zipperColor, hasHood, hasZipper, logoVisible, measurements, view]);

    const drawRealisticDesign = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;

        // 1. Scene Setup
        ctx.clearRect(0, 0, w, h);
        // Clean Grey Gradient Background
        const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
        bgGrad.addColorStop(0, "#f8f9fa");
        bgGrad.addColorStop(1, "#e9ecef");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Ground Shadow
        ctx.fillStyle = "rgba(0,0,0,0.1)";
        ctx.beginPath();
        ctx.ellipse(cx, h - 50, 160, 25, 0, 0, Math.PI * 2);
        ctx.fill();

        // 2. Calculation Constants
        const scale = 3.8; 
        const headY = 60;
        const { shoulder, chest, waist, hips, armLength, inseam } = measurements;
        
        // Convert to pixels
        const shoulderPx = shoulder * scale;
        const chestPx = (chest / 3.1) * scale; 
        const waistPx = (waist / 3.1) * scale;
        const hipPx = (hips / 3.1) * scale;
        const armLenPx = armLength * scale;
        const legLenPx = inseam * scale;

        // Y Positions
        const neckY = headY + 50;
        const shoulderY = neckY + 15;
        const armpitY = shoulderY + (chestPx * 0.45);
        const waistY = shoulderY + 150; 
        const hipY = waistY + 60;
        const crotchY = hipY + 15;
        const kneeY = crotchY + (legLenPx * 0.5);
        const ankleY = crotchY + legLenPx;

        // Fit Modifiers (affect width)
        let fitMod = 0;
        if (fit === 'slim') fitMod = -12;
        if (fit === 'loose') fitMod = 25;

        // Widths for drawing
        const chestW = (chestPx/2) + fitMod;
        const waistW = (waistPx/2) + fitMod;
        const hipW   = (hipPx/2) + fitMod + 5;

        // Draw Mannequin Head
        const drawHead = () => {
             ctx.fillStyle = "#e0c0a0"; // Skin
             if (view === 'side') {
                 // Side Profile Head
                 ctx.beginPath();
                 ctx.ellipse(cx, headY + 10, 30, 36, 0, 0, Math.PI * 2); 
                 ctx.fill();
                 ctx.fillRect(cx - 10, headY + 30, 20, 40); // Neck
             } else {
                 // Front/Back Head
                 ctx.fillRect(cx - 15, headY + 30, 30, 40); // Neck
                 ctx.beginPath();
                 ctx.arc(cx, headY + 10, 35, 0, Math.PI * 2);
                 ctx.fill();
             }
        };
        drawHead();

        // Helper: Draw Pants Legs
        const drawLegs = (isSide = false) => {
            if (mode !== 'tracksuit' && mode !== 'pant') return;
            
            ctx.fillStyle = mainColor;
            const pWaist = waistW - 2;
            const pHip = hipW;
            const pKnee = 40 + (fitMod/2);
            const pAnkle = 32 + (fitMod/2);

            if (isSide) {
                // Side View Leg (Single wide leg)
                ctx.beginPath();
                ctx.moveTo(cx - pWaist + 10, waistY);
                ctx.lineTo(cx + pWaist - 10, waistY); // Side waist
                ctx.quadraticCurveTo(cx + pHip + 10, hipY, cx + pKnee + 10, kneeY); // Butt/Back leg
                ctx.lineTo(cx + pAnkle + 10, ankleY);
                ctx.lineTo(cx - pAnkle + 5, ankleY);
                ctx.quadraticCurveTo(cx - pKnee, kneeY, cx - pWaist + 10, waistY);
                ctx.fill();

                // Side Stripe
                if (designPattern !== 'none' && designPattern !== 'chest_block') {
                     ctx.strokeStyle = accentColor;
                     const sideX = cx; // Middle of side view
                     if (designPattern === 'single_stripe') {
                         ctx.lineWidth = 8;
                         ctx.beginPath(); ctx.moveTo(sideX, waistY); ctx.lineTo(sideX, ankleY); ctx.stroke();
                     } else if (designPattern === 'double_stripe') {
                         ctx.lineWidth = 4;
                         ctx.beginPath(); ctx.moveTo(sideX - 4, waistY); ctx.lineTo(sideX - 4, ankleY); ctx.stroke();
                         ctx.beginPath(); ctx.moveTo(sideX + 4, waistY); ctx.lineTo(sideX + 4, ankleY); ctx.stroke();
                     }
                     // Side panel covers mostly the middle
                     else if (designPattern === 'side_panel') {
                         ctx.fillStyle = accentColor;
                         ctx.fillRect(sideX - 10, waistY, 20, ankleY - waistY);
                     }
                }
            } else {
                // Front/Back Legs
                const drawLeg = (side) => {
                     const dir = side === 'left' ? -1 : 1;
                     const hipPtX = cx + (dir * pHip);
                     const waistPtX = cx + (dir * pWaist);
                     
                     ctx.beginPath();
                     ctx.moveTo(cx, crotchY); 
                     ctx.lineTo(waistPtX, waistY + 10); 
                     ctx.bezierCurveTo(hipPtX + (dir*5), hipY, cx + (dir*(pKnee+15)), kneeY, cx + (dir*(pAnkle+15)), ankleY);
                     ctx.lineTo(cx + (dir * 15), ankleY);
                     ctx.bezierCurveTo(cx + (dir*20), kneeY, cx + (dir*10), hipY + 20, cx, crotchY); 
                     ctx.fill();
                     
                     // Patterns (Side seams only visible on edges)
                     if (designPattern !== 'none' && designPattern !== 'chest_block') {
                         // Simplify patterns for back view (same positions)
                         const patternX = cx + (dir*(pAnkle+15)); // Approximate edge
                         if (designPattern === 'single_stripe') {
                             ctx.strokeStyle = accentColor; ctx.lineWidth = 8;
                             ctx.beginPath(); ctx.moveTo(waistPtX, waistY+10); 
                             ctx.bezierCurveTo(hipPtX + (dir*5), hipY, cx + (dir*(pKnee+15)), kneeY, patternX, ankleY); ctx.stroke();
                         }
                         else if (designPattern === 'side_panel') {
                             ctx.fillStyle = accentColor;
                             ctx.beginPath(); ctx.moveTo(waistPtX, waistY+10);
                             ctx.bezierCurveTo(hipPtX + (dir*5), hipY, cx + (dir*(pKnee+15)), kneeY, patternX, ankleY);
                             ctx.lineTo(cx + (dir*(pAnkle+5)), ankleY);
                             ctx.bezierCurveTo(cx + (dir*(pKnee+5)), kneeY, hipPtX - (dir*5), hipY, waistPtX - (dir*15), waistY+10); ctx.fill();
                         }
                     }
                };
                drawLeg('left');
                drawLeg('right');
            }
        };

        // Draw Jacket (Logic Split)
        if (mode === 'tracksuit' || mode === 'shirt') {
            const shL = cx - (shoulderPx/2);
            const shR = cx + (shoulderPx/2);

            // --- HOOD ---
            if (hasHood) {
                // shadeColor function is defined later, so we might need it inside or defined earlier. 
                // However, since it's defined in component scope, we need to make sure it's accessible or duplicate helper inside.
                // For safety, let's use a local helper or ensure the main one is defined.
                // The main `shadeColor` is defined BELOW this effect in the file currently (lines 28-30). 
                // JavaScript hoisting for const functions doesn't work like `function`.
                // FIX: Move shadeColor logic inside or depend on it being defined earlier. 
                // Since I am inserting this block, I will define a local helper here to be safe.
                const localShade = (col, amt) => {
                    let usePound = false;
                    if (col[0] == "#") { col = col.slice(1); usePound = true; }
                    let num = parseInt(col,16);
                    let r = (num >> 16) + amt;
                    if (r > 255) r = 255; else if  (r < 0) r = 0;
                    let b = ((num >> 8) & 0x00FF) + amt;
                    if (b > 255) b = 255; else if  (b < 0) b = 0;
                    let g = (num & 0x0000FF) + amt;
                    if (g > 255) g = 255; else if (g < 0) g = 0;
                    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
                };
                
                ctx.fillStyle = localShade(mainColor, -20);
                
                if (view === 'back') {
                    // Hood covers neck in back view
                    ctx.beginPath();
                    ctx.moveTo(shL + 10, shoulderY);
                    ctx.quadraticCurveTo(cx, neckY - 20, shR - 10, shoulderY);
                    ctx.quadraticCurveTo(cx, neckY + 40, shL + 10, shoulderY);
                    ctx.fill();
                } else {
                    // Behind neck
                    ctx.beginPath();
                    ctx.moveTo(shL + 15, neckY - 5);
                    ctx.quadraticCurveTo(cx, neckY - 45, shR - 15, neckY - 5);
                    ctx.lineTo(shR - 5, shoulderY);
                    ctx.lineTo(shL + 5, shoulderY);
                    ctx.fill();
                }
            }

            // --- TORSO ---
            ctx.fillStyle = mainColor;
            ctx.beginPath();

            if (view === 'side') {
                // Side Torso
                const sideW = chestW * 0.6; 
                ctx.moveTo(cx - 10, neckY);
                ctx.lineTo(cx + 10, neckY);
                ctx.quadraticCurveTo(cx + sideW + 10, armpitY, cx + sideW, waistY); // Front curve
                ctx.lineTo(cx - sideW, waistY); // Back
                ctx.quadraticCurveTo(cx - sideW - 5, armpitY, cx - 10, neckY + 10);
                ctx.fill();
                
                // Side Pancel Pattern
                if (designPattern === 'side_panel') {
                    ctx.fillStyle = accentColor;
                    ctx.fillRect(cx - 5, armpitY, 10, waistY - armpitY);
                }
            } else {
                // Front & Back Torso (Similar Shape)
                ctx.moveTo(cx - 25, neckY + 10); // Neck Left
                ctx.quadraticCurveTo(shL, neckY, shL - 5, shoulderY + 8); // Shoulder L
                ctx.bezierCurveTo(shL - 10, armpitY, cx - chestW, armpitY + 20, cx - waistW, waistY); // Side L
                ctx.lineTo(cx - hipW, hipY); // Hem L
                ctx.quadraticCurveTo(cx, hipY + 15, cx + hipW, hipY); // Bottom Hem
                ctx.lineTo(cx + waistW, waistY); // Hem R -> Waist R
                ctx.bezierCurveTo(cx + chestW, armpitY + 20, shR + 10, armpitY, shR + 5, shoulderY + 8); // Side R
                ctx.quadraticCurveTo(shR, neckY, cx + 25, neckY + 10); // Shoulder R
                
                if (view === 'front') {
                    ctx.quadraticCurveTo(cx, neckY + 35, cx - 25, neckY + 10); // Collar Dip
                } else {
                     ctx.quadraticCurveTo(cx, neckY + 5, cx - 25, neckY + 10); // High Neck Back
                }
                ctx.fill();

                // Shading
                const torsoGrad = ctx.createLinearGradient(shL, shoulderY, shR, shoulderY);
                torsoGrad.addColorStop(0, "rgba(0,0,0,0.3)");
                torsoGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
                torsoGrad.addColorStop(1, "rgba(0,0,0,0.3)");
                ctx.fillStyle = torsoGrad;
                ctx.fill();

                // Front Details
                if (view === 'front') {
                    if (designPattern === 'chest_block') {
                        ctx.fillStyle = accentColor;
                        ctx.beginPath();
                        ctx.moveTo(cx - chestW + 2, armpitY + 10);
                        ctx.lineTo(cx + chestW - 2, armpitY + 10);
                        ctx.lineTo(cx + waistW - 5, waistY - 20);
                        ctx.lineTo(cx - waistW + 5, waistY - 20);
                        ctx.fill();
                        if (logoVisible) { ctx.fillStyle = mainColor; ctx.font = "bold 14px Arial"; ctx.fillText("BRAND", cx - 25, armpitY + 50); }
                    } else if (logoVisible) {
                        ctx.fillStyle = accentColor; ctx.font = "bold 14px Arial"; ctx.fillText("BRAND", cx + chestW - 50, armpitY + 40);
                    }
                    if (hasZipper && mode !== 'shirt-pullover') {
                        ctx.strokeStyle = zipperColor; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx, neckY + 35); ctx.lineTo(cx, hipY); ctx.stroke();
                    }
                }
                
                // Side Panels (Visible on edges in front/back)
                if (designPattern === 'side_panel') {
                     ctx.fillStyle = accentColor;
                     // Left
                     ctx.beginPath(); ctx.moveTo(cx - chestW + 2, armpitY + 25); ctx.lineTo(cx - waistW + 2, waistY); 
                     ctx.lineTo(cx - hipW + 2, hipY); ctx.lineTo(cx - hipW + 15, hipY - 2); ctx.lineTo(cx - chestW + 15, armpitY + 28); ctx.fill();
                     // Right
                     ctx.beginPath(); ctx.moveTo(cx + chestW - 2, armpitY + 25); ctx.lineTo(cx + waistW - 2, waistY); 
                     ctx.lineTo(cx + hipW - 2, hipY); ctx.lineTo(cx + hipW - 15, hipY - 2); ctx.lineTo(cx + chestW - 15, armpitY + 28); ctx.fill();
                }
            } // end front/back torso

            // --- ARMS ---
            // Draw Arm Helper
            const drawArm = (side) => {
                const startX = side === 'left' ? shL - 5 : shR + 5;
                const dir = side === 'left' ? -1 : 1;
                const isSideView = view === 'side';
                
                // In side view, draw one arm down center
                let armSx = startX, armSy = shoulderY + 5;
                let armWx = startX + (dir * 35), armWy = shoulderY + armLenPx;

                if (isSideView) {
                     // Draw sleeve on the visible body
                     armSx = cx; armSy = shoulderY + 10;
                     armWx = cx; armWy = shoulderY + armLenPx;
                }

                ctx.fillStyle = mainColor;
                ctx.beginPath();
                ctx.moveTo(armSx, armSy);
                
                if (isSideView) {
                     // Straight down arm
                     ctx.quadraticCurveTo(armSx + 20, (armSy+armWy)/2, armWx + 12, armWy);
                     ctx.lineTo(armWx - 12, armWy);
                     ctx.quadraticCurveTo(armSx - 20, (armSy+armWy)/2, armSx, armSy);
                } else {
                    // Regular angled arm
                    ctx.lineTo(armSx + (dir*12), armpitY + 15);
                    ctx.quadraticCurveTo(armSx + (dir*25), (armSy + armWy)/2, armWx + (dir*12), armWy);
                    ctx.lineTo(armWx - (dir*15), armWy);
                    ctx.quadraticCurveTo(armSx - (dir*28), (armSy + armWy)/2, armSx, armSy);
                }
                ctx.fill();
                
                // Arm Patterns (Stripes)
                if (designPattern.includes('stripe')) {
                     ctx.strokeStyle = accentColor;
                     let count = designPattern === 'single_stripe' ? 1 : (designPattern === 'double_stripe' ? 2 : 3);
                     let lw = designPattern === 'single_stripe' ? 8 : (designPattern === 'double_stripe' ? 4 : 2.5);
                     ctx.lineWidth = lw;
                     
                     for(let i=0; i<count; i++) {
                         let off = i*4;
                         ctx.beginPath();
                         if (isSideView) {
                              ctx.moveTo(armSx + (off - count*2), armSy);
                              ctx.lineTo(armWx + (off - count*2), armWy);
                         } else {
                              ctx.moveTo(armSx - (dir*(2+off)), armSy);
                              ctx.quadraticCurveTo(armSx - (dir*(18+off)), (armSy+armWy)/2, armWx - (dir*(2+off)), armWy);
                         }
                         ctx.stroke();
                     }
                }
            };

            if (view === 'side') {
                drawArm('left'); // Only one arm visible
            } else {
                drawArm('left');
                drawArm('right');
            }
        }
        
        // Draw Legs Last (if needed to overlap)
        drawLegs(view === 'side');

        // Pant Shading Mask
        if (mode === 'tracksuit' || mode === 'pant') {
            const pantGrad = ctx.createLinearGradient(cx - hipW, hipY, cx + hipW, hipY);
            pantGrad.addColorStop(0, "rgba(0,0,0,0.3)");
            pantGrad.addColorStop(0.5, "rgba(255,255,255,0.05)");
            pantGrad.addColorStop(1, "rgba(0,0,0,0.3)");
            ctx.globalCompositeOperation = 'source-atop';
            ctx.fillStyle = pantGrad;
            ctx.fillRect(0, waistY, w, h);
            ctx.globalCompositeOperation = 'source-over';
        }

    };
    
    // --- UTILITIES & HANDLERS ---
    const shadeColor = (color, percent) => {
        let f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    };

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const calculatePrice = () => {
        let base = 2999; // Tracksuit default
        if (mode === 'shirt') base = 1499;
        if (mode === 'pant') base = 1299;
        
        if (designPattern !== 'none') base += 250;
        if (hasHood) base += 300;
        if (hasZipper) base += 150;
        
        return base;
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();

        // 1. Validation: Authentication
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.email) {
            toast.error("Please login to add custom items to cart");
            return;
        }

        // 2. Validation: Measurements
        if (measurements.chest < 50 || measurements.waist < 40) {
            toast.error("Please check your measurements, they seem too small.");
            return;
        }

        // 3. Generate Thumbnail & Price
        const finalPrice = calculatePrice();
        let designImage = "https://images.pexels.com/photos/8483487/pexels-photo-8483487.jpeg?auto=compress&cs=tinysrgb&w=600";
        
        if (canvasRef.current) {
            try {
                // Capture the current state of the canvas
                designImage = canvasRef.current.toDataURL("image/png");
            } catch (err) {
                console.error("Failed to capture canvas image", err);
            }
        }

        // 4. Save to DB
        const customOrderData = {
            userId: user.id || user._id || null, 
            userEmail: user.email,
            productType: mode,
            designPattern,
            fit,
            mainColor,
            accentColor,
            zipperColor,
            hasHood,
            hasZipper,
            logoVisible,
            measurements,
            customNotes: `Custom ${mode} design`,
            totalPrice: finalPrice,
            designImage: designImage // Save big string to DB if schema allows, or handle upload separately. For now sending string.
        };

        let savedOrderId = null;
        try {
            const response = await fetch('/api/custom-orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customOrderData)
            });

            if (response.ok) {
                const result = await response.json();
                if (Array.isArray(result.orderId)) {
                    if (result.orderId.length > 0 && result.orderId[0] && typeof result.orderId[0] === 'object') {
                         savedOrderId = result.orderId[0].insertId || result.orderId[0].id;
                    }
                } else if (typeof result.orderId === 'object' && result.orderId !== null) {
                    savedOrderId = result.orderId.insertId || result.orderId.id;
                } else {
                    savedOrderId = result.orderId;
                }
            }
        } catch (error) {
            console.error("Network error saving design", error);
        }

        // 5. Add to Redux Cart
        const customProduct = {
            id: savedOrderId || Date.now(), 
            title: `Custom ${mode.charAt(0).toUpperCase() + mode.slice(1)} Design`,
            price: finalPrice,
            description: `${fit} fit, ${designPattern}. ${mainColor}/${accentColor}.`,
            category: "custom",
            image: designImage,
            rating: { rate: 5, count: 1 },
            qty: 1
        };

        dispatch(addItem(customProduct));
        toast.success(`Custom Design added to Cart! (₹${finalPrice})`);
        setTimeout(() => {
            navigate('/cart');
        }, 1000);
    };

    // UI Helper Components
    const ColorInput = ({label, val, set}) => (
        <div className="mb-2">
            <label className="text-white-50 small d-block mb-1">{label}</label>
            <div className="d-flex align-items-center bg-dark rounded p-1 border border-secondary">
                <input type="color" className="p-0 border-0 bg-transparent rounded" style={{width: 30, height: 30}} value={val} onChange={e => set(e.target.value)} />
                <span className="ms-2 small text-light font-monospace">{val}</span>
            </div>
        </div>
    );

    const Range = ({label, val, set, min, max}) => (
        <div className="mb-3">
             <div className="d-flex justify-content-between mb-1">
                 <span className="small text-light">{label}</span>
                 <span className="small text-secondary">{val} cm</span>
             </div>
             <input type="range" className="form-range range-custom" min={min} max={max} value={val} onChange={e => set(e.target.value)} />
        </div>
    );

    return (
        <>
            <Navbar />
                <div className="container-fluid custom-studio-wrapper shadow-lg overflow-hidden bg-white px-0">
                    <div className="row g-0 align-items-start">
                        {/* --- LEFT SIDEBAR (Controls) --- */}
                        <div className="col-lg-3 order-2 order-lg-1 text-white border-end border-light-subtle d-flex flex-column" style={{ height: 'calc(100vh - 80px)', backgroundColor: '#0a192f', position: 'sticky', top: '80px' }}>
                            <div className="p-4 border-bottom border-light-subtle flex-shrink-0" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
                                <h4 className="fw-bold mb-3 text-white">
                                    <i className="fa fa-pencil-square-o me-2 text-warning"></i>{t('custom.title')}
                                </h4>
                                {/* Stepper Indicator */}
                                <div className="d-flex align-items-center mb-0">
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${step >= 1 ? 'bg-warning text-dark' : 'bg-secondary text-white-50'}`} style={{width: 24, height: 24}}>1</div>
                                    <div className="mx-2 bg-secondary" style={{height: 2, flex: 1}}>
                                        <div className="bg-warning h-100" style={{width: step === 2 ? '100%' : '50%'}}></div>
                                    </div>
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center fw-bold small ${step === 2 ? 'bg-warning text-dark' : 'bg-secondary text-white-50'}`} style={{width: 24, height: 24}}>2</div>
                                </div>
                                <div className="d-flex justify-content-between mt-1">
                                    <small className={step === 1 ? 'text-white' : 'text-white-50'}>Visuals</small>
                                    <small className={step === 2 ? 'text-white' : 'text-white-50'}>Fit</small>
                                </div>
                            </div>
                            
                            <div className="flex-grow-1 overflow-y-auto custom-scrollbar"> 
                                <form onSubmit={handleAddToCart} className="p-4 d-flex flex-column gap-4">
                                {step === 1 && (
                                    <>
                                        {/* 1. PRODUCT & STYLE */}
                                        <section>
                                            <h6 className="text-uppercase text-white-50 fw-bold small mb-3 ls-1">1. Choose Style</h6>
                                            <div className="btn-group w-100 mb-3 bg-white bg-opacity-10 rounded p-1">
                                                {['tracksuit', 'shirt', 'pant'].map(m => (
                                                    <button key={m} type="button" className={`btn btn-sm rounded ${mode === m ? 'btn-warning fw-bold text-dark shadow' : 'text-white'}`} onClick={() => setMode(m)}>
                                                        {t(`custom.${m}`)}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <label className="text-white-50 small mb-1">{t('custom.pattern_style')}</label>
                                                    <select className="form-select form-select-sm bg-dark text-white border-secondary" value={designPattern} onChange={(e) => setDesignPattern(e.target.value)}>
                                                        <option value="none">{t('custom.solid')}</option>
                                                        <option value="single_stripe">{t('custom.single_stripe')}</option>
                                                        <option value="double_stripe">{t('custom.double_stripe')}</option>
                                                        <option value="triple_stripe">{t('custom.triple_stripe')}</option>
                                                        <option value="side_panel">Side Panel</option>
                                                        <option value="chest_block">Chest Block</option>
                                                    </select>
                                                </div>
                                                <div className="col-6">
                                                     <label className="text-white-50 small mb-1">Fit Type</label>
                                                     <select className="form-select form-select-sm bg-dark text-white border-secondary" value={fit} onChange={(e) => setFit(e.target.value)}>
                                                        <option value="slim">Slim Fit</option>
                                                        <option value="regular">Regular</option>
                                                        <option value="loose">Loose</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </section>

                                        {/* 2. COLORS */}
                                        <section>
                                            <h6 className="text-uppercase text-white-50 fw-bold small mb-3 ls-1">2. Colors</h6>
                                            <div className="d-flex gap-3 justify-content-between">
                                                <div className="flex-fill"><ColorInput label="Main Code" val={mainColor} set={setMainColor} /></div>
                                                <div className="flex-fill"><ColorInput label="Accent" val={accentColor} set={setAccentColor} /></div>
                                                <div className="flex-fill"><ColorInput label="Zipper" val={zipperColor} set={setZipperColor} /></div>
                                            </div>
                                        </section>

                                        {/* 3. FEATURES */}
                                        <section>
                                            <h6 className="text-uppercase text-white-50 fw-bold small mb-3 ls-1">3. Details</h6>
                                            <div className="d-flex flex-wrap gap-3">
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" checked={hasHood} onChange={e => setHasHood(e.target.checked)} />
                                                    <label className="form-check-label text-light small">{t('custom.hoodie')}</label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" checked={hasZipper} onChange={e => setHasZipper(e.target.checked)} />
                                                    <label className="form-check-label text-light small">{t('custom.zipper')}</label>
                                                </div>
                                                <div className="form-check form-switch">
                                                    <input className="form-check-input" type="checkbox" checked={logoVisible} onChange={e => setLogoVisible(e.target.checked)} />
                                                    <label className="form-check-label text-light small">{t('custom.logo')}</label>
                                                </div>
                                            </div>
                                        </section>

                                        <div className="mt-auto pt-4">
                                            <button type="button" className="btn btn-warning w-100 py-2 fw-bold shadow text-uppercase tracking-wider rounded-pill" onClick={handleNextStep}>
                                                Next: Measurements <i className="fa fa-arrow-right ms-2"></i>
                                            </button>
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <>
                                        {/* 4. MEASUREMENTS */}
                                        <section className="animate-fade-in">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                 <h6 className="text-uppercase text-white-50 fw-bold small mb-0 ls-1">4. Your Measurements (cm)</h6>
                                                 <small className="text-warning cursor-pointer hover-underline" onClick={() => setStep(1)}>Edit Design</small>
                                            </div>
                                            
                                            <div className="row g-3">
                                                <div className="col-12"><Range label="Chest / Bust" val={measurements.chest} set={v => setMsmt('chest', v)} min={80} max={140} /></div>
                                                <div className="col-12"><Range label="Waist Size" val={measurements.waist} set={v => setMsmt('waist', v)} min={60} max={130} /></div>
                                                <div className="col-6"><Range label="Shoulder" val={measurements.shoulder} set={v => setMsmt('shoulder', v)} min={35} max={60} /></div>
                                                <div className="col-6"><Range label="Length" val={measurements.topLength} set={v => setMsmt('topLength', v)} min={50} max={100} /></div>
                                                <div className="col-6"><Range label="Arm" val={measurements.armLength} set={v => setMsmt('armLength', v)} min={45} max={80} /></div>
                                                <div className="col-6"><Range label="Inseam" val={measurements.inseam} set={v => setMsmt('inseam', v)} min={60} max={100} /></div>
                                                <div className="col-6"><Range label="Thigh" val={measurements.thigh} set={v => setMsmt('thigh', v)} min={40} max={80} /></div>
                                                <div className="col-6"><Range label="Ankle" val={measurements.ankle} set={v => setMsmt('ankle', v)} min={20} max={45} /></div>
                                            </div>
                                        </section>

                                        <div className="mt-auto pt-4 d-flex gap-2">
                                            <button type="button" className="btn btn-outline-light py-2 px-3 fw-bold rounded-pill" onClick={() => setStep(1)}>
                                                <i className="fa fa-arrow-left"></i>
                                            </button>
                                            <button type="submit" className="btn btn-success flex-grow-1 py-2 fw-bold shadow text-uppercase tracking-wider rounded-pill">
                                                <i className="fa fa-check me-2"></i> {t('custom.add_to_cart')} - <i className="fa fa-inr small me-1"></i>{calculatePrice()}
                                            </button>
                                        </div>
                                    </>
                                )}
                                </form>
                            </div>
                        </div>

                        {/* --- RIGHT CANVAS (Sticky) --- */}
                        <div className="col-lg-9 order-1 order-lg-2 bg-light p-0 position-relative">
                             <div className="d-flex justify-content-center align-items-center bg-gray-200" style={{ minHeight: '60vh', background: '#e5e7eb' }}>
                                 <div className="position-relative w-100 h-100 d-flex justify-content-center align-items-center">
                                     {/* 3D Visualizer Badge */}
                                     <div className="position-absolute top-0 start-0 m-4 bg-white px-3 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2" style={{zIndex: 10}}>
                                        <div className="bg-dark rounded-circle d-flex align-items-center justify-content-center" style={{width: 24, height: 24}}>
                                            <i className="fa fa-cube text-white" style={{fontSize: 12}}></i>
                                        </div>
                                        <span className="fw-bold text-dark small tracking-wide">{t('custom.visualizer')}</span>
                                     </div>

                                     {/* 3D ROTATION BUTTONS */}
                                     <div className="position-absolute bottom-0 start-50 translate-middle-x mb-4 d-flex gap-2" style={{zIndex: 10}}>
                                        <button className={`btn btn-sm ${view === 'front' ? 'btn-dark' : 'btn-light border'} rounded-pill px-4 py-2 shadow fw-bold`} onClick={() => setView('front')}>Front</button>
                                        <button className={`btn btn-sm ${view === 'side' ? 'btn-dark' : 'btn-light border'} rounded-pill px-4 py-2 shadow fw-bold`} onClick={() => setView('side')}>Side</button>
                                        <button className={`btn btn-sm ${view === 'back' ? 'btn-dark' : 'btn-light border'} rounded-pill px-4 py-2 shadow fw-bold`} onClick={() => setView('back')}>Back</button>
                                     </div>

                                     <canvas ref={canvasRef} width={800} height={850} className="shadow-lg bg-white rounded-4" style={{ width: 'auto', height: '85vh', maxHeight: '500px', objectFit: 'contain' }}></canvas>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            <Footer />
        </>
    );
};

export default CartCustom;
