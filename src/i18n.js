import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      "navbar": {
        "deliver_to": "Delivering to",
        "update_location": "Update location",
        "search_placeholder": "Search Prince Garments",
        "hello": "Hello,",
        "sign_in": "sign in",
        "account_lists": "Account & Lists",
        "returns": "Returns",
        "orders": "& Orders",
        "cart": "Cart",
        "home": "Home",
        "products": "Products",
        "gifts": "Gifts",
        "about": "About",
        "contact": "Contact",
        "ask_ai": "Ask AI",
        "custom_orders": "Custom Orders",
        "all": "All",
        "shop_by_cat": "Shop By Category"
      },
      "footer": {
        "company_desc": "Discover the latest trends in fashion with Prince Garments. We provide high-quality apparel that matches your style and personality.",
        "products": "Products",
        "men": "Men's Clothing",
        "women": "Women's Clothing",
        "accessories": "Accessories",
        "new_arrivals": "New Arrivals",
        "useful_links": "Useful Links",
        "help": "Help",
        "address": "Jani Khurd, Meerut, UP, India",
        "rights": "All rights reserved by"
      },
      "hero": {
        "slide1_title": "New Season Arrivals",
        "slide1_subtitle": "Spring / Summer 2026",
        "slide1_text": "Discover the latest trends in fashion. Elevate your wardrobe with our exclusive collection.",
        "slide2_title": "Limited Time Offers",
        "slide2_subtitle": "Exclusive Deal",
        "slide2_text": "Get up to 50% off on our bestsellers. Don't miss out on these premium styles.",
        "slide3_title": "Shop the Look",
        "slide3_subtitle": "Curated Styles",
        "slide3_text": "Handpicked outfits for every occasion. Dress to impress with our new arrivals.",
        "shop_now": "Shop Now",
        "view_lookbook": "View Lookbook"
      },
      "custom": {
        "title": "Design Studio",
        "product_type": "Product Type",
        "tracksuit": "Tracksuit",
        "shirt": "Shirt",
        "pant": "Pant",
        "design_config": "Design Config",
        "pattern_style": "Pattern Style",
        "solid": "Solid / Plain",
        "single_stripe": "Single Stripe",
        "double_stripe": "Double Stripe",
        "triple_stripe": "Triple Stripe",
        "color_palette": "Color Palette",
        "main_fabric": "Main Fabric",
        "accents": "Accents",
        "features": "Features",
        "hoodie": "Add Hoodie",
        "zipper": "Full Zipper",
        "logo": "Show Logo",
        "measurements": "Measurements",
        "add_to_cart": "Add to Cart",
        "visualizer": "3D Visualizer"
      }
    }
  },
  hi: {
    translation: {
      "navbar": {
        "deliver_to": "डिलीवरी",
        "update_location": "स्थान अपडेट करें",
        "search_placeholder": "प्रिंस गारमेंट्स में खोजें",
        "hello": "नमस्ते,",
        "sign_in": "साइन इन करें",
        "account_lists": "खाता और सूचियां",
        "returns": "वापसी",
        "orders": "और ऑर्डर",
        "cart": "कार्ट",
        "home": "होम",
        "products": "उत्पाद",
        "gifts": "उपहार",
        "about": "हमारे बारे में",
        "contact": "संपर्क करें",
        "ask_ai": "AI से पूछें",
        "custom_orders": "कस्टम ऑर्डर",
        "all": "सभी",
        "shop_by_cat": "श्रेणी अनुसार खरीदारी"
      },
      "footer": {
        "company_desc": "प्रिंस गारमेंट्स के साथ फैशन के नवीनतम रुझानों की खोज करें। हम उच्च गुणवत्ता वाले परिधान प्रदान करते हैं जो आपकी शैली और व्यक्तित्व से मेल खाते हैं।",
        "products": "उत्पाद",
        "men": "पुरुषों के कपड़े",
        "women": "महिलाओं के कपड़े",
        "accessories": "सामान (Accessories)",
        "new_arrivals": "नया आगमन",
        "useful_links": "महत्वपूर्ण लिंक",
        "help": "सहायता",
        "address": "जानी खुर्द, मेरठ, यूपी, भारत",
        "rights": "सभी अधिकार सुरक्षित हैं"
      },
      "hero": {
        "slide1_title": "नए सीजन का आगमन",
        "slide1_subtitle": "वसंत / ग्रीष्म 2026",
        "slide1_text": "फैशन में नवीनतम रुझानों की खोज करें। हमारे विशेष संग्रह के साथ अपनी अलमारी को अपग्रेड करें।",
        "slide2_title": "सीमित समय की पेशकश",
        "slide2_subtitle": "विशिष्ट सौदा",
        "slide2_text": "हमारे बेस्टसेलर पर 50% तक की छूट प्राप्त करें। इन प्रीमियम शैलियों को न चूकें।",
        "slide3_title": "लुक खरीदें",
        "slide3_subtitle": "क्यूरेटेड शैलियाँ",
        "slide3_text": "हर अवसर के लिए चुने गए संगठन। हमारे नए आगमन के साथ प्रभावित करने के लिए तैयार हों।",
        "shop_now": "अभी खरीदें",
        "view_lookbook": "लुकबुक देखें"
      },
      "custom": {
        "title": "डिज़ाइन स्टूडियो",
        "product_type": "उत्पाद प्रकार",
        "tracksuit": "ट्रक सूट",
        "shirt": "शर्ट",
        "pant": "पैंट",
        "design_config": "डिज़ाइन कॉन्फ़िगरेशन",
        "pattern_style": "पैटर्न शैली",
        "solid": "ठोस / सादा",
        "single_stripe": "एकल पट्टी",
        "double_stripe": "दोहरी पट्टी",
        "triple_stripe": "तहरी पट्टी",
        "color_palette": "रंग पैलेट",
        "main_fabric": "मुख्य कपडा",
        "accents": "एक्जेन्ट",
        "features": "विशेषताएँ",
        "hoodie": "हुडी जोड़ें",
        "zipper": "पूरी ज़िप",
        "logo": "लोगो दिखाएं",
        "measurements": "माप",
        "add_to_cart": "कार्ट में जोड़ें",
        "visualizer": "3D विज़ुअलाइज़र"
      }
    }
  },
  pa: {
    translation: {
      "navbar": {
        "deliver_to": "डिलिवरी",
        "update_location": "स्थान अपडेट करें",
        "search_placeholder": "प्रिंस गारमेंट्स विच खोजो",
        "hello": "सति श्री अकाल,",
        "sign_in": "साइन इन करो",
        "account_lists": "खाता ते सूचियां",
        "returns": "वापसी",
        "orders": "ते ऑर्डर",
        "cart": "कार्ट",
        "home": "होम",
        "products": "उत्पाद",
        "gifts": "तोहफे",
        "about": "साडे बारे",
        "contact": "संपर्क करो",
        "ask_ai": "AI नू पूछो",
        "custom_orders": "कस्टम ऑर्डर",
        "all": "सारे",
        "shop_by_cat": "श्रेणी अनुसार खरीदारी"
      },
      "footer": {
        "company_desc": "प्रिंस गारमेंट्स दे नाल फैशन दे नवे ट्रेंड लभो। असीं उच्च गुणवत्ता वाले कपड़े प्रदान करदे हां जो तुहाडी शैली ते व्यक्तित्व नाल मेल खांदे हन।",
        "products": "उत्पाद",
        "men": "मर्दां दे कपड़े",
        "women": "औरतां दे कपड़े",
        "accessories": "समान (Accessories)",
        "new_arrivals": "नवा आगमन",
        "useful_links": "जरूरी लिंक",
        "help": "मदद",
        "address": "जानी खुर्द, मेरठ, यूपी, भारत",
        "rights": "सारे अधिकार सुरक्षित हन"
      },
      "hero": {
        "slide1_title": "नवे सीजन दा आगमन",
        "slide1_subtitle": "बसंत / गर्मी 2026",
        "slide1_text": "फैशन विच नवे ट्रेंड लभो। साडे खास संग्रह दे नाल अपनी अलमारी नू अपग्रेड करो।",
        "slide2_title": "सीमित समय दी पेशकश",
        "slide2_subtitle": "खास सौदा",
        "slide2_text": "साडे बेस्टसेलर ते 50% तक दी छूट पाओ। एहना प्रीमियम स्टाइल्स नू ना छड्डो।",
        "slide3_title": "लुक खरीदो",
        "slide3_subtitle": "चुनिंदा स्टाइल्स",
        "slide3_text": "हर मौके लई चुने गए कपड़े। साडे नवे आगमन दे नाल प्रभावित करण लई तैयार होवो।",
        "shop_now": "हुणे खरीदो",
        "view_lookbook": "लुकबुक देखो"
      },
      "custom": {
        "title": "डिज़ाइन स्टूडियो",
        "product_type": "उतपाद दी किसम",
        "tracksuit": "ट्रक सूट",
        "shirt": "शर्ट",
        "pant": "पैंट",
        "design_config": "डिज़ाइन सेटिंग",
        "pattern_style": "पैटर्न स्टाइल",
        "solid": "सादा",
        "single_stripe": "इक्क पट्टी",
        "double_stripe": "दोहरी पट्टी",
        "triple_stripe": "तहरी पट्टी",
        "color_palette": "रंग पैलेट",
        "main_fabric": "मुख्य कपड़ा",
        "accents": "एक्जेन्ट",
        "features": "खासियत",
        "hoodie": "हुडी पाओ",
        "zipper": "पूरी ज़िप",
        "logo": "लोगो दिखाओ",
        "measurements": "नाप",
        "add_to_cart": "कार्ट विच पाओ",
        "visualizer": "3D विज़ुअलाइज़र"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", 
    interpolation: {
      escapeValue: false 
    }
  });

export default i18n;
