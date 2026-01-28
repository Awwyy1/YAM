import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Instagram, Sun, Moon, Leaf, Coffee, Globe, ArrowUpRight, MapPin, Clock, Trash2, Gamepad2, Share2, Lock, Trophy, AlertCircle, Bomb, Type, Palette, Layout, Grid, Check, Sparkles, Eye, Camera, MessageSquare, Heart } from 'lucide-react';

const COLORS = {
  light: {
    base: '#F4F4F2',
    text: '#1C1C1E',
    accent: '#FF3B30',
    card: '#FFFFFF',
    success: '#34C759',
  },
  dark: {
    base: '#0A0A0A',
    text: '#F0F0F0',
    accent: '#FF3B30',
    card: '#161616',
    success: '#30D158',
  }
};

type Lang = 'en' | 'ge';

const CONTENT = {
    en: {
        nav: {
            home: "HOME",
            brand: "BRAND",
            menu: "MENU",
            shop: "SHOP",
            game: "GAME",
            oracle: "ORACLE",
            logo: "YAM BOOK",
        },
        hero: {
            since: "SINCE 2026",
            title_1: "GOOD",
            title_2: "MORNINGS",
            title_3: "START WITH",
            cta: "EXPLORE THE TASTE",
            marquee: "Organic Soil • Daily Roast • Fair Trade •"
        },
        home: {
            todays_brew: "Today's Brew",
            bring_home: "Bring YAM",
            bring_home_accent: "Home.",
            view_apparel: "View Apparel",
            visit: "Visit",
            visit_the: "The",
            location_title: "Location",
            location_val: "Coming soon",
            location_city: "GE, Batumi",
            hours_title: "Hours",
            hours_week: "Mon - Fri: 09:00 - 21:00",
            hours_end: "Sat - Sun: 10:00 - 21:00",
            desc_visit: "Experience the full sensory immersion of Yam Coffee at our flagship roastery and cafe."
        },
        brand: {
            manifesto_label: "Manifesto",
            title_1: "BEYOND THE",
            title_accent: "BEAN.",
            desc: "YAM is not just coffee. It's an obsession with quality and a tribute to organic roots. We source directly from farmers who treat their land with respect.",
            founded: "Founded",
            sourcing: "Sourcing",
            features: [
                 { title: 'Organic', text: 'Pure, chemical-free process from soil to cup.' },
                 { title: 'Roast', text: 'Small-batch roasting for maximum flavor clarity.' },
                 { title: 'Impact', text: 'Sustainably grown, ethically sourced, globally loved.' },
            ]
        },
        menu: {
            label: "Our Selection",
            title_1: "CRAFTED",
            title_accent: "DAILY.",
            desc: "Meticulously sourced beans, precision brewing, and organic ingredients. Our menu is a living reflection of the season.",
            dietary: "Oat and Almond milk available upon request",
            tax: "All prices include tax"
        },
        shop: {
            label: "YAM APPAREL",
            title_1: "WEAR",
            title_2: "THE",
            title_accent: "VIBE.",
            desc_hero: "Limited edition drops. Cotton. Made in Portugal.",
            add_to_cart: "Add to Cart",
            new_drop: "New Drop",
            materials: { title: "Materials", text: "100% Organic heavyweight cotton. Pre-shrunk and garment dyed for a vintage feel and long-lasting color." },
            fit: { title: "Fit Guide", text: "Boxy, relaxed fit. Dropped shoulders. We recommend taking your true size for the intended look, or sizing down for a slimmer fit." },
            shipping: { title: "Shipping", text: "Worldwide shipping available. Free standard shipping on orders over" },
        },
        game: {
            label: "YAM TOWER",
            title_1: "PLAY",
            title_2: "TO",
            title_accent: "WIN.",
            desc: "Climb 8 rows without hitting a bomb. Reach the top to win a free signature coffee.",
            enter_code: "Enter Access Code",
            get_code: "Get Access Code",
            start: "Start Game",
            locked_desc: "This game is exclusive. Share to unlock.",
            how_to_unlock: "How to Unlock",
            step_1: "Take a screenshot of this page.",
            step_2: "Post to your Instagram Story & tag @yam.coffee",
            step_3: "We will DM you the daily access code.",
            have_code: "I have a code",
            code_placeholder: "Enter code...",
            unlock_btn: "Unlock Game",
            row: "Row",
            win_title: "YOU WON!",
            win_desc: "Screenshot this ticket and show it to our barista.",
            lose_title: "BOOM!",
            lose_desc: "You hit a bad bean. Better luck next time.",
            retry: "Try Again",
            fake_share_btn: "I posted it! Give me code.",
            ticket_id: "TICKET ID",
            valid_until: "VALID FOR 24H"
        },
        oracle: {
            label: "YAM ORACLE",
            title_1: "DIGITAL",
            title_accent: "FATE.",
            desc: "The ancient tradition of tassology, digitized. Sip the pixels, reveal your path.",
            btn_sip: "TAKE A SIP",
            btn_reading: "READING GROUNDS...",
            btn_retry: "CONSULT AGAIN",
            instruction: "Focus on your question...",
            predictions: [
                "Focus on the grind today. The results will brew.",
                "Unexpected sweetness is hiding in the bitter moments.",
                "Your energy is roasting perfectly. Don't burn it.",
                "A bold move will bring a rich finish.",
                "Let it steep a little longer. Patience is key.",
                "The sediment settles in your favor today.",
                "Like a good espresso, keep it short and strong.",
                "Clarity comes with the next cup.",
                "The foam of uncertainty will vanish soon.",
                "Trust your gut, it's caffeinated."
            ]
        },
        logo: {
            label: "IDENTITY",
            title_1: "THE",
            title_accent: "YAM BOOK.",
            desc: "A digital archive of our visual language. Pure, bold, and organic.",
            concept: "Concept",
            concept_desc: "The YAM logo is a typographic monolith. It represents the weight of quality and the fluidity of natural taste. No unnecessary symbols—only the strength of the name.",
            palette: "Palette",
            typography: "Typography",
            iconography_title: "Iconography",
            iconography_desc: "Geometric, consistent, and stroke-based. Our icons serve as functional waypoints, maintaining the same stroke weight as our headlines.",
            construction_title: "Construction",
            construction_desc: "Built on a strict 4px grid system. The spacing is defined by the width of the letter 'Y'. Always maintain 100% clear space around the logomark.",
            dos: "Do",
            donts: "Don't",
            usage: "Iconography",
            colors: [
                { name: "Blaze Orange", hex: "#FF3B30", role: "Primary Accent / Energy" },
                { name: "Alabaster", hex: "#F4F4F2", role: "Base Background / Organic" },
                { name: "Obsidian", hex: "#1C1C1E", role: "Typography / Contrast" }
            ],
            fonts: [
                { family: "Outfit", style: "Bold / Black", usage: "Headlines (EN)" },
                { family: "Noto Sans Geo", style: "Bold / 900", usage: "Headlines (GE)" }
            ],
            values_title: "Brand Values",
            values_desc: "Four pillars that define every decision we make—from sourcing to serving.",
            values: [
                { title: "Organic", desc: "No shortcuts. Chemical-free from soil to cup. We believe purity is the ultimate luxury.", num: "01" },
                { title: "Craft", desc: "Small-batch obsession. Every roast is a conscious act, not an assembly line.", num: "02" },
                { title: "Minimal", desc: "Strip away the noise. What remains is essential, intentional, and honest.", num: "03" },
                { title: "Community", desc: "Coffee is a ritual shared. We build spaces where strangers become regulars.", num: "04" },
            ],
            moodboard_title: "Visual Language",
            moodboard_desc: "The sensory world of YAM. Raw textures, warm tones, deliberate stillness.",
            photo_title: "Photography",
            photo_desc: "Our visual rules. Every image must feel like a quiet morning—focused, warm, unhurried.",
            photo_rules: [
                { label: "High Contrast", desc: "Deep shadows, bright highlights. No flat midtones." },
                { label: "Natural Light", desc: "Always. No studio flash. Golden hour preferred." },
                { label: "Minimal Props", desc: "The subject is the hero. Remove everything else." },
            ],
            voice_title: "Brand Voice",
            voice_desc: "How YAM speaks. Confident but never loud. Direct but never cold.",
            voice_do: "We say",
            voice_dont: "Never",
            voice_examples: [
                { yes: "Crafted daily.", no: "Made fresh every day!" },
                { yes: "Sourced with intent.", no: "We care about our farmers!!" },
                { yes: "Less. Better.", no: "We offer the best quality at great prices!" },
            ]
        },
        cart: {
            title: "Your Stash",
            empty: "Your cart is empty",
            subtotal: "Subtotal",
            checkout: "Checkout",
            one_size: "One Size"
        },
        footer: {
            rights: "© 2026 YAM COFFEE GROUP. ALL RIGHTS RESERVED."
        }
    },
    ge: {
         nav: {
            home: "მთავარი",
            brand: "ბრენდი",
            menu: "მენიუ",
            shop: "შოპი",
            game: "თამაში",
            oracle: "ორაკული",
            logo: "YAM BOOK",
        },
        hero: {
            since: "2026 წლიდან",
            title_1: "კარგი",
            title_2: "დილა იწყება",
            title_3: "YAM-ით",
            cta: "გაუსინჯე გემო",
            marquee: "ორგანული ნიადაგი • ყოველდღიური მოხალვა • სამართლიანი ვაჭრობა •"
        },
        home: {
            todays_brew: "დღის ყავა",
            bring_home: "წაიღე YAM",
            bring_home_accent: "სახლში.",
            view_apparel: "ტანსაცმელი",
            visit: "ესტუმრე",
            visit_the: "",
            location_title: "ლოკაცია",
            location_val: "მალე",
            location_city: "ბათუმი, საქართველო",
            hours_title: "საათები",
            hours_week: "ორშ - პარ: 09:00 - 21:00",
            hours_end: "შაბ - კვი: 10:00 - 21:00",
            desc_visit: "გამოცადე Yam Coffee-ს სრული არომატი ჩვენს მთავარ სამწვავსა და კაფეში."
        },
        brand: {
            manifesto_label: "მანიფესტი",
            title_1: "მარცვლის",
            title_accent: "მიღმა.",
            desc: "YAM უბრალოდ ყავა არ არის. ეს არის ხარისხისადმი სწრაფვა და პატივისცემა ორგანული ფესვებისადმი. ჩვენ მარცვლებს პირდაპირ ფერმერებისგან ვიღებთ.",
            founded: "დაარსდა",
            sourcing: "წყარო",
            features: [
                 { title: 'ორგანული', text: 'სუფთა, ქიმიკატების გარეშე, ნიადაგიდან ჭიქამდე.' },
                 { title: 'მოხალვა', text: 'მცირე პარტიებად მოხალვა მაქსიმალური გემოსთვის.' },
                 { title: 'გავლენა', text: 'მდგრადი მოყვანა, ეთიკური მოპოვება.' },
            ]
        },
        menu: {
            label: "ჩვენი არჩევანი",
            title_1: "იქმნება",
            title_accent: "ყოველდღე.",
            desc: "გულმოდგინედ შერჩეული მარცვლები, ზუსტი მომზადება და ორგანული ინგრედიენტები. ჩვენი მენიუ სეზონის ანარეკლია.",
            dietary: "შვრიის და ნუშის რძე მოთხოვნით",
            tax: "ფასები მოიცავს გადასახადებს"
        },
        shop: {
            label: "YAM ტანსაცმელი",
            title_1: "ატარე",
            title_2: "ეს",
            title_accent: "ვაიბი.",
            desc_hero: "ლიმიტირებული კოლექცია. ბამბა. დამზადებულია პორტუგალიაში.",
            add_to_cart: "დამატება",
            new_drop: "ახალი",
            materials: { title: "მასალა", text: "100% ორგანული მძიმე ბამბა. წინასწარ დამუშავებული ვინტაჟური ეფექტისთვის." },
            fit: { title: "ზომა", text: "თავისუფალი სტილი (Boxy). დაშვებული მხრები. რეკომენდებულია თქვენი ზომის არჩევა." },
            shipping: { title: "მიწოდება", text: "მიწოდება მთელ მსოფლიოში. უფასოა შეკვეთებზე ზევით:" },
        },
        game: {
            label: "YAM TOWER",
            title_1: "ითამაშე",
            title_2: "და",
            title_accent: "მოიგე.",
            desc: "ავიდეთ 8 საფეხურზე ბომბის გარეშე. მიაღწიეთ მწვერვალს და მიიღეთ უფასო ყავა.",
            enter_code: "შეიყვანეთ კოდი",
            get_code: "მიიღეთ კოდი",
            start: "დაწყება",
            locked_desc: "თამაში ექსკლუზიურია. გააზიარეთ გასახსნელად.",
            how_to_unlock: "როგორ გავხსნათ",
            step_1: "გადაიღეთ ეკრანის სურათი (Screenshot).",
            step_2: "დაპოსტეთ ინსტაგრამ სთორიში და მონიშნეთ @yam.coffee",
            step_3: "ჩვენ გამოგიგზავნით დღიურ კოდს პირადში.",
            have_code: "მაქვს კოდი",
            code_placeholder: "შეიყვანეთ კოდი...",
            unlock_btn: "გახსნა",
            row: "რიგი",
            win_title: "თქვენ მოიგეთ!",
            win_desc: "გადაუღეთ ეკრანს სურათი და აჩვენეთ ბარისტას.",
            lose_title: "ბუმ!",
            lose_desc: "ცუდი მარცვალი შეგხვდათ. სცადეთ თავიდან.",
            retry: "თავიდან",
            fake_share_btn: "დავპოსტე! მომეცი კოდი.",
            ticket_id: "ბილეთის ID",
            valid_until: "აქტიურია 24სთ"
        },
        oracle: {
            label: "YAM ორაკული",
            title_1: "ციფრული",
            title_accent: "ბედი.",
            desc: "ყავაზე მკითხაობის უძველესი ტრადიცია, გაციფრულებული. მოსვი პიქსელები, გაიგე მომავალი.",
            btn_sip: "მოსვი ყავა",
            btn_reading: "ვიკვლევ ნალექს...",
            btn_retry: "თავიდან",
            instruction: "კონცენტრირდი კითხვაზე...",
            predictions: [
                "ფოკუსირდი მთავარზე. შედეგი მოიხარშება.",
                "მოულოდნელი სიტკბო იმალება სიმწარეში.",
                "შენი ენერგია იდეალურად იხალება. არ დაწვა.",
                "თამამი ნაბიჯი მდიდარ გემოს მოიტანს.",
                "ცოტა ხანს კიდევ დაელოდე. მოთმინება გასაღებია.",
                "ნალექი შენს სასარგებლოდ ლაგდება.",
                "კარგი ესპრესოსავით, იყავი მოკლე და ძლიერი.",
                "სიმკვეთრე შემდეგ ჭიქასთან ერთად მოვა.",
                "გაურკვევლობის ქაფი მალე გაქრება.",
                "ენდე ინტუიციას, ის კოფეინითაა სავსე."
            ]
        },
        logo: {
            label: "იდენტობა",
            title_1: "YAM",
            title_accent: "BOOK.",
            desc: "ჩვენი ვიზუალური ენის არქივი. სუფთა, მკვეთრი და ორგანული.",
            concept: "კონცეფცია",
            concept_desc: "YAM-ის ლოგო არის ტიპოგრაფიული მონოლითი. ის გამოხატავს ხარისხის წონას და ბუნებრივი გემოს სითხეს. ზედმეტი სიმბოლოების გარეშე — მხოლოდ სახელის ძალა.",
            palette: "პალიტრა",
            typography: "ტიპოგრაფია",
            iconography_title: "იკონოგრაფია",
            iconography_desc: "გეომეტრიული და ხაზოვანი. ჩვენი ხატულები ფუნქციური ორიენტირებია, იგივე ხაზის სისქით რაც სათაურები.",
            construction_title: "კონსტრუქცია",
            construction_desc: "აგებულია მკაცრ 4px ბადეზე. დაშორება განისაზღვრება ასო 'Y'-ს სიგანით. დაიცავით სივრცე.",
            dos: "კი",
            donts: "არა",
            usage: "იკონოგრაფია",
            values_title: "ბრენდის ღირებულებები",
            values_desc: "ოთხი საყრდენი, რომელიც ყველა გადაწყვეტილებას განსაზღვრავს — მოპოვებიდან მიწოდებამდე.",
            values: [
                { title: "ორგანული", desc: "არანაირი კომპრომისი. ქიმიკატების გარეშე, ნიადაგიდან ჭიქამდე.", num: "01" },
                { title: "ხელობა", desc: "მცირე პარტიების ობსესია. ყოველი მოხალვა შეგნებული აქტია.", num: "02" },
                { title: "მინიმალიზმი", desc: "მოაშორე ხმაური. რაც რჩება — არსებითია, მიზანმიმართული და გულწრფელი.", num: "03" },
                { title: "საზოგადოება", desc: "ყავა გაზიარებული რიტუალია. ვქმნით სივრცეებს, სადაც უცნობები მუდმივ სტუმრებად იქცევიან.", num: "04" },
            ],
            moodboard_title: "ვიზუალური ენა",
            moodboard_desc: "YAM-ის სენსორული სამყარო. ნედლი ტექსტურები, თბილი ტონები, მიზანმიმართული სიმშვიდე.",
            photo_title: "ფოტოგრაფია",
            photo_desc: "ჩვენი ვიზუალური წესები. ყოველი სურათი მშვიდი დილის შეგრძნებას უნდა იწვევდეს.",
            photo_rules: [
                { label: "მაღალი კონტრასტი", desc: "ღრმა ჩრდილები, კაშკაშა აქცენტები." },
                { label: "ბუნებრივი შუქი", desc: "ყოველთვის. სტუდიური ფლეში არ გამოიყენება." },
                { label: "მინიმალური რეკვიზიტი", desc: "სუბიექტი არის გმირი. ყველაფერი ზედმეტი მოაშორე." },
            ],
            voice_title: "ბრენდის ხმა",
            voice_desc: "როგორ ლაპარაკობს YAM. თავდაჯერებულად, მაგრამ არასდროს ხმამაღლა.",
            voice_do: "ჩვენ ვამბობთ",
            voice_dont: "არასდროს",
            voice_examples: [
                { yes: "იქმნება ყოველდღე.", no: "ყოველდღე ახალს ვამზადებთ!" },
                { yes: "მიზნობრივად მოპოვებული.", no: "ჩვენ ფერმერებზე ვზრუნავთ!!" },
                { yes: "ნაკლები. უკეთესი.", no: "საუკეთესო ხარისხი საუკეთესო ფასად!" },
            ],
            colors: [
                { name: "Blaze Orange", hex: "#FF3B30", role: "მთავარი აქცენტი / ენერგია" },
                { name: "Alabaster", hex: "#F4F4F2", role: "ბაზა / ორგანული" },
                { name: "Obsidian", hex: "#1C1C1E", role: "ტიპოგრაფია / კონტრასტი" }
            ],
            fonts: [
                { family: "Outfit", style: "Bold / Black", usage: "სათაურები (EN)" },
                { family: "Noto Sans Geo", style: "Bold / 900", usage: "სათაურები (GE)" }
            ]
        },
        cart: {
            title: "კალათა",
            empty: "კალათა ცარიელია",
            subtotal: "ჯამი",
            checkout: "ყიდვა",
            one_size: "ერთი ზომა"
        },
        footer: {
            rights: "© 2026 YAM COFFEE GROUP. ყველა უფლება დაცულია."
        }
    }
};

const COFFEE_MENU_DATA = {
    en: [
        { name: 'Espresso', price: '₾4.50', desc: 'Bold & intense signature blend' },
        { name: 'Flat White', price: '₾5.50', desc: 'Silky micro-foam over ristretto' },
        { name: 'Yam Special', price: '₾6.50', desc: 'Honey-infused cold brew with sea salt' },
        { name: 'Latte', price: '₾5.00', desc: 'Classic espresso with steamed milk' },
        { name: 'Cappuccino', price: '₾4.75', desc: 'Balanced espresso, milk and foam' },
        { name: 'Cortado', price: '₾4.25', desc: 'Equal parts espresso and warm milk' },
        { name: 'Americano', price: '₾4.00', desc: 'Smooth espresso over ice' },
        { name: 'Vanilla Cold Brew', price: '₾5.75', desc: '24-hour steep with natural vanilla' },
        { name: 'Caramel Macchiato', price: '₾5.50', desc: 'Layered milk and espresso with caramel' },
        { name: 'Oat Milk Mocha', price: '₾6.00', desc: 'Rich chocolate and creamy oat milk' },
    ],
    ge: [
        { name: 'ესპრესო', price: '₾4.50', desc: 'მკვეთრი და ინტენსიური ნაზავი' },
        { name: 'ფლატ უაითი', price: '₾5.50', desc: 'აბრეშუმისებრი ქაფი რისტრეტოზე' },
        { name: 'Yam სპეშალი', price: '₾6.50', desc: 'თაფლიანი ქოლდ ბრიუ ზღვის მარილით' },
        { name: 'ლატე', price: '₾5.00', desc: 'კლასიკური ესპრესო ცხელი რძით' },
        { name: 'კაპუჩინო', price: '₾4.75', desc: 'ესპრესოსა და რძის ბალანსი' },
        { name: 'კორტადო', price: '₾4.25', desc: 'თანაბარი რაოდენობის ესპრესო და რძე' },
        { name: 'ამერიკანო', price: '₾4.00', desc: 'რბილი ესპრესო წყალზე' },
        { name: 'ვანილის ქოლდ ბრიუ', price: '₾5.75', desc: '24 საათიანი დაყოვნება, ბუნებრივი ვანილი' },
        { name: 'კარამელ მაკიატო', price: '₾5.50', desc: 'რძის, ესპრესოს და კარამელის ფენები' },
        { name: 'შვრიის მოკა', price: '₾6.00', desc: 'მდიდარი შოკოლადი და შვრიის რძე' },
    ]
};

const BEANS_products = {
  en: [
    { id: 1, name: 'ETHIOPIA YIRGACHEFFE', note: 'Floral, Citrus, Light Body', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, name: 'COLOMBIA SUPREMO', note: 'Caramel, Nutty, Balanced', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, name: 'YAM HOUSE BLEND', note: 'Dark Chocolate, Berry, Bold', img: 'https://images.unsplash.com/photo-1611854779393-1b2ae9d22571?q=80&w=1000&auto=format&fit=crop' },
  ],
  ge: [
    { id: 1, name: 'ეთიოპია ირგაჩეფე', note: 'ყვავილოვანი, ციტრუსი, მსუბუქი სხეული', img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=1000&auto=format&fit=crop' },
    { id: 2, name: 'კოლუმბია სუპრემო', note: 'კარამელი, თხილეული, დაბალანსებული', img: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop' },
    { id: 3, name: 'YAM ჰაუს ბლენდი', note: 'მუქი შოკოლადი, კენკრა, მკვეთრი', img: 'https://images.unsplash.com/photo-1611854779393-1b2ae9d22571?q=80&w=1000&auto=format&fit=crop' },
  ]
};

const FULL_MENU_CATEGORIES = {
  en: [
    {
        title: "Signatures",
        items: [
        { name: "Yam Special", price: "₾6.50", desc: "Honey-infused cold brew, sea salt foam" },
        { name: "Black Sesame", price: "₾7.00", desc: "Espresso, black sesame paste, oat milk" },
        ]
    },
    {
        title: "Espresso Bar",
        items: [
        { name: "Double Espresso", price: "₾4.50", desc: "Signature house blend" },
        { name: "Cortado", price: "₾5.25", desc: "1:1 Espresso and milk" },
        { name: "Flat White", price: "₾5.50", desc: "Thin micro-foam" },
        ]
    }
  ],
  ge: [
      {
        title: "საფირმო",
        items: [
        { name: "Yam სპეშალი", price: "₾6.50", desc: "თაფლიანი ქოლდ ბრიუ, ზღვის მარილიანი ქაფით" },
        { name: "შავი სეზამი", price: "₾7.00", desc: "ესპრესო, შავი სეზამის პასტა, შვრიის რძე" },
        ]
    },
    {
        title: "ესპრესო ბარი",
        items: [
        { name: "დოპპიო", price: "₾4.50", desc: "საფირმო ჰაუს ბლენდი" },
        { name: "კორტადო", price: "₾5.25", desc: "1:1 ესპრესო და რძე" },
        { name: "ფლატ უაითი", price: "₾5.50", desc: "თხელი მიკრო-ქაფი" },
        ]
    }
  ]
};

const MERCH_ITEMS = {
    en: [
        { id: 101, name: "YAM ARCHIVE TEE", color: "BLAZE ORANGE", price: "₾45.00", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1000&auto=format&fit=crop", desc: "Heavyweight cotton with puff print logo.", comingSoon: true },
        { id: 102, name: "ABSTRACT NOIR", color: "MIDNIGHT BLACK", price: "₾50.00", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop", desc: "Oversized fit. Back abstract tonal print.", comingSoon: true },
        { id: 103, name: "YAM HOODIE", color: "VOID", price: "₾85.00", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop", comingSoon: true },
        { id: 104, name: "CANVAS TOTE", color: "RAW", price: "₾25.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop", comingSoon: true }
    ],
    ge: [
        { id: 101, name: "YAM არქივ TEE", color: "მკვეთრი ნარინჯისფერი", price: "₾45.00", img: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?q=80&w=1000&auto=format&fit=crop", desc: "მძიმე ბამბა, მოცულობითი ლოგო.", comingSoon: true },
        { id: 102, name: "აბსტრაქტ ნუარი", color: "შუაღამის შავი", price: "₾50.00", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1000&auto=format&fit=crop", desc: "ოვერსაიზ სტილი. აბსტრაქტული პრინტი ზურგზე.", comingSoon: true },
        { id: 103, name: "YAM ჰუდი", color: "VOID", price: "₾85.00", img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1000&auto=format&fit=crop", comingSoon: true },
        { id: 104, name: "ტილოს ჩანთა", color: "RAW", price: "₾25.00", img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop", comingSoon: true }
    ]
};

interface Product {
    id: number;
    name: string;
    price: string;
    img: string;
    desc?: string;
    color?: string;
    note?: string;
    comingSoon?: boolean;
}

const CoffeeBeanIcon = ({ size = 24, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
         <path d="M15.83 5.43C14.2 4.49 12.19 4.34 10.45 5.01C8.71 5.68 7.49 7.08 7.15 8.91C7.05 9.44 6.99 9.99 6.99 10.55C6.99 14.93 10.51 18.5 14.88 18.55C17.03 18.57 19.01 17.74 20.47 16.35C20.65 16.18 20.73 15.93 20.69 15.68C20.65 15.44 20.49 15.23 20.27 15.12C18.66 14.28 17.54 12.69 17.37 10.87C17.19 9.05 17.97 7.27 19.43 6.22C19.64 6.07 19.74 5.82 19.69 5.57C19.64 5.32 19.46 5.12 19.22 5.04C18.14 4.67 16.97 4.81 15.83 5.43ZM11.45 7.61C12.39 7.25 13.48 7.33 14.35 7.83C14.73 8.05 15.15 7.97 15.43 7.64C15.71 7.31 15.77 6.84 15.58 6.46C14.69 4.64 12.34 3.73 10.39 4.47C8.44 5.22 7.22 7.19 7.51 9.27C7.62 9.99 7.88 10.66 8.24 11.26C8.84 10.02 9.98 9.08 11.35 8.78C11.97 8.64 12.44 8.21 12.61 7.6C12.68 7.32 12.59 7.03 12.38 6.82C12.16 6.61 11.85 6.54 11.58 6.64C10.74 6.96 9.87 7.02 9.05 6.82C9.72 5.92 10.74 5.34 11.88 5.34C13.25 5.34 14.49 5.88 15.41 6.77C13.88 7.91 13.06 9.77 13.25 11.66C13.44 13.56 14.63 15.21 16.34 16.05C15.22 17.02 13.78 17.58 12.21 17.55C8.97 17.51 6.35 14.88 6.35 11.62C6.35 11.2 6.4 10.79 6.48 10.39C7.03 8.89 8.28 7.73 9.8 7.27C10.33 7.11 10.9 7.22 11.45 7.61Z" />
    </svg>
);

const PriceDisplay: React.FC<{ price: string; className?: string }> = ({ price, className = "" }) => {
    const hasSymbol = price.trim().startsWith('₾');
    const symbol = '₾';
    const amount = price.replace(symbol, '');
    return (
        <span className={className}>
            {hasSymbol && <span className="text-[0.75em] mr-[1px] font-normal opacity-70">{symbol}</span>}
            {amount}
        </span>
    );
};

const BrandPage: React.FC<{ isDark: boolean; lang: Lang }> = ({ isDark, lang }) => {
  const theme = isDark ? COLORS.dark : COLORS.light;
  const t = CONTENT[lang].brand;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
        <motion.div initial={{ x: -30, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
          <span className="text-[#FF3B30] font-bold tracking-widest text-sm uppercase mb-4 block">{t.manifesto_label}</span>
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-8 uppercase">{t.title_1} <br /> <span className="text-[#FF3B30]">{t.title_accent}</span></h2>
          <p className="text-xl opacity-70 leading-relaxed mb-10 max-w-lg">{t.desc}</p>
          <div className="flex gap-10">
            <div><p className="text-4xl font-black mb-1">2026</p><p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{t.founded}</p></div>
            <div><p className="text-4xl font-black mb-1">Direct</p><p className="text-[10px] font-bold opacity-50 uppercase tracking-widest">{t.sourcing}</p></div>
          </div>
        </motion.div>
        <div className="rounded-[40px] overflow-hidden aspect-[4/5] shadow-xl">
          <img src="https://images.unsplash.com/photo-1447078806655-40579c2520d6?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Brand" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {t.features.map((item, i) => (
          <div key={i} className="p-10 rounded-[30px]" style={{ backgroundColor: theme.card }}>
            <div className="text-[#FF3B30] mb-6">{i === 0 && <Leaf />}{i === 1 && <Coffee />}{i === 2 && <Globe />}</div>
            <h4 className="text-2xl font-black uppercase">{item.title}</h4>
            <p className="opacity-60">{item.text}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const MenuPage: React.FC<{ isDark: boolean; lang: Lang }> = ({ isDark, lang }) => {
  const t = CONTENT[lang].menu;
  const categories = FULL_MENU_CATEGORIES[lang];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="mb-24 text-center">
            <span className="text-[#FF3B30] font-bold tracking-widest text-sm uppercase mb-4 block">{t.label}</span>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-6">{t.title_1} <br/> <span className="text-[#FF3B30]">{t.title_accent}</span></h2>
             <p className="text-xl opacity-60 max-w-2xl mx-auto">{t.desc}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16">
            {categories.map((category, idx) => (
                <div key={idx}>
                    <h3 className="text-3xl font-black uppercase mb-8 pb-4 border-b border-current opacity-80 flex items-center gap-4">{category.title}</h3>
                    <div className="space-y-8">
                        {category.items.map((item, i) => (
                            <div key={i} className="group flex justify-between items-baseline cursor-default">
                                <div>
                                    <h4 className="text-xl font-bold uppercase group-hover:text-[#FF3B30] transition-colors duration-300">{item.name}</h4>
                                    <p className="text-sm opacity-50 mt-1">{item.desc}</p>
                                </div>
                                <PriceDisplay price={item.price} className="text-xl font-bold tabular-nums" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="mt-24 text-center opacity-40 text-sm uppercase tracking-widest border-t border-current pt-10 mx-auto max-w-md">
            <p>{t.dietary} (+ <PriceDisplay price="₾0.50" className="inline" />)</p>
            <p className="mt-2">{t.tax}</p>
        </div>
    </motion.div>
  );
};

const ShopPage: React.FC<{ isDark: boolean; addToCart: (item: Product) => void; lang: Lang }> = ({ isDark, addToCart, lang }) => {
    const t = CONTENT[lang].shop;
    const items = MERCH_ITEMS[lang];
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-40 pb-20 px-6 md:px-12">
            <div className="max-w-[90rem] mx-auto">
                 <div className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div>
                        <span className="text-[#FF3B30] font-bold tracking-widest text-sm uppercase mb-4 block">{t.label}</span>
                        <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.85]">{t.title_1} <br/> {t.title_2} <span className="text-[#FF3B30]">{t.title_accent}</span></h2>
                    </div>
                    <p className="text-xl font-medium uppercase tracking-wide opacity-70 max-w-xs mb-2">{t.desc_hero}</p>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div key={item.id} className={`group ${item.comingSoon ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                            <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                                {item.comingSoon ? (
                                    <>
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover filter blur-xl opacity-50 scale-110" />
                                        <div className="absolute inset-0 flex items-center justify-center z-10">
                                            <span className="text-2xl font-black uppercase tracking-tighter text-center leading-none transform -rotate-12 border-4 border-current px-4 py-2 opacity-50">Reveal<br/>Soon</span>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} src={item.img} alt={item.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        <div className="absolute inset-x-4 bottom-4">
                                            <button onClick={(e) => { e.stopPropagation(); addToCart(item); }} className="w-full py-4 bg-[#FF3B30] text-white font-black uppercase tracking-widest text-xs opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">{t.add_to_cart}</button>
                                        </div>
                                        <div className="absolute top-4 left-4 bg-white dark:bg-black px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{t.new_drop}</div>
                                    </>
                                )}
                            </div>
                            <div className="flex justify-between items-baseline opacity-100">
                                <div className={item.comingSoon ? "opacity-30 blur-sm select-none" : ""}>
                                    <h3 className="text-xl font-black uppercase mb-1 group-hover:text-[#FF3B30] transition-colors">{item.name}</h3>
                                    <p className="text-[10px] font-bold tracking-widest opacity-50 uppercase mb-2">{item.color}</p>
                                </div>
                                <div className={item.comingSoon ? "opacity-30 blur-sm select-none" : ""}>
                                    <PriceDisplay price={item.price} className="text-lg font-bold" />
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </motion.div>
    );
};

const LogoPage: React.FC<{ isDark: boolean; lang: Lang }> = ({ isDark, lang }) => {
    const t = CONTENT[lang].logo;
    const icons = [Coffee, Leaf, Sun, Globe, ShoppingCart, ArrowUpRight];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="mb-32">
                <span className="text-[#FF3B30] font-bold tracking-widest text-sm uppercase mb-4 block">{t.label}</span>
                <h2 className="text-6xl md:text-9xl font-black tracking-tighter uppercase leading-[0.8] mb-10">{t.title_1} <br/> <span className="text-[#FF3B30]">{t.title_accent}</span></h2>
                <p className="text-2xl opacity-60 max-w-2xl">{t.desc}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-40">
                <div className="bg-white dark:bg-zinc-900 aspect-video rounded-[40px] flex items-center justify-center p-20 shadow-xl border border-black/5 dark:border-white/5">
                    <span className="text-6xl md:text-8xl font-black tracking-tighter uppercase"><span className="text-[#FF3B30]">YAM</span> <span className="opacity-20">COFFEE</span></span>
                </div>
                <div><h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-4"><Layout className="text-[#FF3B30]" size={28} /> {t.concept}</h3><p className="text-xl opacity-60 leading-relaxed">{t.concept_desc}</p></div>
            </div>
            <div className="mb-40">
                 <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 border-b border-current/10 pb-6"><Palette className="text-[#FF3B30]" size={28} /> {t.palette}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {t.colors.map((color, idx) => (
                        <div key={idx} className="group">
                            <div className="h-64 rounded-[30px] mb-6 shadow-lg" style={{ backgroundColor: color.hex, border: idx === 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}></div>
                            <h4 className="text-xl font-black uppercase mb-1">{color.name}</h4>
                            <p className="text-sm font-bold opacity-40 uppercase tracking-widest mb-2">{color.hex}</p>
                            <p className="text-xs opacity-60">{color.role}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mb-40">
                <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 border-b border-current/10 pb-6"><Type className="text-[#FF3B30]" size={28} /> {t.typography}</h3>
                <div className="space-y-20">
                    {t.fonts.map((font, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-10 md:gap-20">
                            <div className="md:w-1/3"><h4 className="text-2xl font-black uppercase mb-2">{font.family}</h4><p className="text-sm font-bold opacity-40 uppercase tracking-widest">{font.style}</p></div>
                            <div className="flex-1"><p className={`text-4xl md:text-6xl font-black leading-tight ${idx === 1 ? 'font-ge' : 'font-en'}`}>{lang === 'en' ? "The quick brown fox jumps over the lazy dog." : "ყავა, რომელიც შენს დღეს ცვლის."}</p></div>
                        </div>
                    ))}
                </div>
            </div>
             <div className="mb-40">
                <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 border-b border-current/10 pb-6">
                    <Layout className="text-[#FF3B30]" size={28} /> {t.iconography_title}
                </h3>
                <p className="text-xl opacity-60 max-w-2xl mb-12">{t.iconography_desc}</p>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                    {icons.map((Icon, i) => (
                         <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-800 rounded-3xl flex items-center justify-center text-[#FF3B30]">
                             <Icon size={32} strokeWidth={2} />
                         </div>
                    ))}
                </div>
            </div>
             <div className="mb-40">
                 <h3 className="text-3xl font-black uppercase mb-12 flex items-center gap-4 border-b border-current/10 pb-6">
                    <Grid className="text-[#FF3B30]" size={28} /> {t.construction_title}
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="bg-zinc-100 dark:bg-zinc-900 rounded-[40px] p-12 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `linear-gradient(#888 1px, transparent 1px), linear-gradient(90deg, #888 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
                        <span className="text-[10rem] font-black tracking-tighter uppercase relative z-10 leading-none">YAM</span>
                        <div className="absolute bottom-8 right-8 text-xs font-mono opacity-40">GRID: 40PX</div>
                    </div>
                    <div>
                         <p className="text-xl opacity-60 leading-relaxed mb-10">{t.construction_desc}</p>
                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="h-40 bg-green-500/10 border-2 border-green-500 rounded-2xl flex items-center justify-center">
                                     <span className="font-black text-2xl">YAM</span>
                                </div>
                                <p className="flex items-center gap-2 text-green-500 font-bold uppercase text-xs tracking-widest"><Check size={14} /> {t.dos}</p>
                            </div>
                             <div className="space-y-4">
                                <div className="h-40 bg-red-500/10 border-2 border-red-500 rounded-2xl flex items-center justify-center overflow-hidden">
                                     <span className="font-black text-2xl italic transform scale-x-125">YAM</span>
                                </div>
                                <p className="flex items-center gap-2 text-red-500 font-bold uppercase text-xs tracking-widest"><X size={14} /> {t.donts}</p>
                            </div>
                         </div>
                    </div>
                </div>
            </div>

            {/* Brand Values */}
            <div className="mb-40">
                <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-4 border-b border-current/10 pb-6">
                    <Heart className="text-[#FF3B30]" size={28} /> {t.values_title}
                </h3>
                <p className="text-xl opacity-60 max-w-2xl mb-16">{t.values_desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {t.values.map((v, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="relative p-10 rounded-[30px] border border-current/5 overflow-hidden group hover:border-[#FF3B30]/20 transition-colors">
                            <span className="absolute top-8 right-8 text-7xl font-black opacity-[0.04] leading-none select-none">{v.num}</span>
                            <span className="text-[#FF3B30] text-xs font-black tracking-[0.3em] uppercase mb-4 block">{v.num}</span>
                            <h4 className="text-3xl font-black uppercase mb-3 tracking-tight">{v.title}</h4>
                            <p className="opacity-50 leading-relaxed text-lg">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Moodboard */}
            <div className="mb-40">
                <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-4 border-b border-current/10 pb-6">
                    <Eye className="text-[#FF3B30]" size={28} /> {t.moodboard_title}
                </h3>
                <p className="text-xl opacity-60 max-w-2xl mb-16">{t.moodboard_desc}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                        { src: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=800&auto=format&fit=crop", span: "row-span-2" },
                        { src: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=800&auto=format&fit=crop", span: "" },
                        { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop", span: "" },
                        { src: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?q=80&w=800&auto=format&fit=crop", span: "" },
                        { src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?q=80&w=800&auto=format&fit=crop", span: "col-span-2 md:col-span-1" },
                        { src: "https://images.unsplash.com/photo-1447078806655-40579c2520d6?q=80&w=800&auto=format&fit=crop", span: "hidden md:block" },
                    ].map((img, i) => (
                        <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={`overflow-hidden rounded-2xl ${img.span}`}>
                            <img src={img.src} alt="" className="w-full h-full object-cover aspect-square grayscale hover:grayscale-0 transition-all duration-700" />
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Photography Style */}
            <div className="mb-40">
                <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-4 border-b border-current/10 pb-6">
                    <Camera className="text-[#FF3B30]" size={28} /> {t.photo_title}
                </h3>
                <p className="text-xl opacity-60 max-w-2xl mb-16">{t.photo_desc}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {t.photo_rules.map((rule, i) => {
                        const photos = [
                            "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=800&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
                            "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?q=80&w=800&auto=format&fit=crop",
                        ];
                        return (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                                <div className="aspect-[4/5] rounded-[30px] overflow-hidden mb-6">
                                    <img src={photos[i]} alt="" className="w-full h-full object-cover" />
                                </div>
                                <h4 className="text-xl font-black uppercase mb-2">{rule.label}</h4>
                                <p className="opacity-50 text-sm leading-relaxed">{rule.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Brand Voice */}
            <div className="mb-40">
                <h3 className="text-3xl font-black uppercase mb-6 flex items-center gap-4 border-b border-current/10 pb-6">
                    <MessageSquare className="text-[#FF3B30]" size={28} /> {t.voice_title}
                </h3>
                <p className="text-xl opacity-60 max-w-2xl mb-16">{t.voice_desc}</p>
                <div className="space-y-6">
                    {t.voice_examples.map((ex, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-8 rounded-[20px] bg-green-500/5 border border-green-500/20">
                                <span className="text-green-500 text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 mb-4"><Check size={12} /> {t.voice_do}</span>
                                <p className="text-2xl font-black uppercase tracking-tight">{ex.yes}</p>
                            </div>
                            <div className="p-8 rounded-[20px] bg-red-500/5 border border-red-500/20">
                                <span className="text-red-500 text-[10px] font-black tracking-[0.3em] uppercase flex items-center gap-2 mb-4"><X size={12} /> {t.voice_dont}</span>
                                <p className="text-2xl font-black uppercase tracking-tight opacity-40 line-through">{ex.no}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

        </motion.div>
    );
};

const GamePage: React.FC<{ isDark: boolean; lang: Lang }> = ({ isDark, lang }) => {
    const t = CONTENT[lang].game;
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [accessCode, setAccessCode] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'won' | 'lost'>('idle');
    const [currentRow, setCurrentRow] = useState(0);
    const [history, setHistory] = useState<Array<{bomb: number, pick: number}>>([]);
    const ROWS = 8;
    const COLS = 4;
    const startGame = () => { setHistory([]); setCurrentRow(0); setGameState('playing'); };
    const handleTileClick = (r: number, c: number) => {
        if (gameState !== 'playing' || r !== currentRow) return;
        const bombIndex = Math.floor(Math.random() * COLS);
        const newHistory = [...history, { bomb: bombIndex, pick: c }];
        setHistory(newHistory);
        if (c === bombIndex) setGameState('lost');
        else if (currentRow === ROWS - 1) setGameState('won');
        else setCurrentRow(prev => prev + 1);
    };
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
                <span className="text-[#FF3B30] font-bold tracking-widest text-sm uppercase mb-4 block flex items-center justify-center gap-2"><Gamepad2 size={16} /> {t.label}</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">{t.title_1} {t.title_2} <span className="text-[#FF3B30]">{t.title_accent}</span></h2>
                <p className="text-xl opacity-60 max-w-lg mx-auto">{t.desc}</p>
            </div>
            {!isUnlocked ? (
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-[30px] shadow-2xl text-center border border-black/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#FF3B30]"></div>
                    <Lock className="mx-auto mb-6 opacity-20" size={48} />
                    <h3 className="text-2xl font-black uppercase mb-2">{t.enter_code}</h3>
                    <form onSubmit={(e) => { e.preventDefault(); setIsUnlocked(true); }} className="space-y-4">
                        <input type="text" value={accessCode} onChange={(e) => setAccessCode(e.target.value.toUpperCase())} placeholder={t.code_placeholder} className="w-full bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl text-center font-bold tracking-widest uppercase outline-none focus:ring-2 ring-[#FF3B30]" />
                        <button type="submit" className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-xl font-bold uppercase tracking-widest text-sm hover:opacity-80">{t.unlock_btn}</button>
                    </form>
                    <button onClick={() => setShowModal(true)} className="mt-6 text-xs font-bold uppercase tracking-widest text-[#FF3B30] hover:underline">{t.get_code}</button>
                </div>
            ) : gameState === 'idle' ? (
                <button onClick={startGame} className="bg-[#FF3B30] text-white px-12 py-6 rounded-full text-xl font-black tracking-widest uppercase shadow-lg">{t.start}</button>
            ) : (
                <div className="flex flex-col-reverse gap-3 p-6 bg-white dark:bg-zinc-900 rounded-[30px] shadow-2xl">
                    {[...Array(ROWS)].map((_, r) => (
                        <div key={r} className="flex gap-3">
                            {[...Array(COLS)].map((_, c) => {
                                let isRevealed = r < history.length && history[r].pick === c;
                                let isBomb = isRevealed && history[r].bomb === c;
                                return (
                                    <button key={`${r}-${c}`} disabled={r !== currentRow || gameState !== 'playing'} onClick={() => handleTileClick(r, c)} className={`w-16 h-16 md:w-20 md:h-20 rounded-xl transition-all ${r === currentRow && gameState === 'playing' ? 'bg-zinc-100 dark:bg-zinc-800 ring-1 ring-[#FF3B30]/20' : 'bg-zinc-50 dark:bg-zinc-900 opacity-20'} ${isRevealed && !isBomb ? 'bg-green-500' : ''} ${isRevealed && isBomb ? 'bg-red-500' : ''}`}>
                                        {isRevealed && !isBomb && <CoffeeBeanIcon size={24} className="text-white mx-auto" />}
                                        {isRevealed && isBomb && <Bomb size={24} className="text-white mx-auto" />}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

const OraclePage: React.FC<{ isDark: boolean; lang: Lang }> = ({ isDark, lang }) => {
    const t = CONTENT[lang].oracle;
    const [state, setState] = useState<'ready' | 'sipping' | 'reading' | 'revealed'>('ready');
    const [prediction, setPrediction] = useState('');
    const [blobs, setBlobs] = useState<string[]>([]);

    useEffect(() => {
        if (state === 'reading') {
            const timeout = setTimeout(() => {
                const randomPred = t.predictions[Math.floor(Math.random() * t.predictions.length)];
                setPrediction(randomPred);
                
                // Generate random blobs for the grounds
                const newBlobs = Array.from({ length: 5 }).map(() => {
                    const size = Math.floor(Math.random() * 80) + 40;
                    const left = Math.floor(Math.random() * 60) + 20;
                    const top = Math.floor(Math.random() * 60) + 20;
                    const radius = `${Math.floor(Math.random() * 50) + 30}% ${Math.floor(Math.random() * 50) + 30}% ${Math.floor(Math.random() * 50) + 30}% ${Math.floor(Math.random() * 50) + 30}%`;
                    return `width: ${size}px; height: ${size}px; left: ${left}%; top: ${top}%; border-radius: ${radius};`;
                });
                setBlobs(newBlobs);
                setState('revealed');
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [state, t.predictions]);

    const handleAction = () => {
        if (state === 'ready') setState('sipping');
        else if (state === 'revealed') setState('ready');
    };

    // Auto transition from sipping to reading
    useEffect(() => {
        if (state === 'sipping') {
            const timeout = setTimeout(() => {
                setState('reading');
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [state]);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-40 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
                <span className="text-[#FF3B30] font-bold tracking-widest text-sm uppercase mb-4 block flex items-center justify-center gap-2"><Sparkles size={16} /> {t.label}</span>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-6">{t.title_1} <span className="text-[#FF3B30]">{t.title_accent}</span></h2>
                <p className="text-xl opacity-60 max-w-lg mx-auto">{t.desc}</p>
            </div>

            <div className="relative w-80 h-80 md:w-96 md:h-96 mb-12 flex items-center justify-center select-none">
                {/* Outer Rim */}
                <div className="absolute inset-0 rounded-full border-[12px] border-zinc-200 dark:border-zinc-800 shadow-2xl z-10"></div>
                
                {/* Liquid / Grounds Container */}
                <div className="absolute inset-4 rounded-full overflow-hidden bg-[#1a1512] flex items-center justify-center transition-all duration-1000">
                    
                    {/* Liquid Animation */}
                    <motion.div 
                        className="absolute inset-0 bg-[#3C2A21]"
                        initial={{ scale: 1 }}
                        animate={{ 
                            scale: state === 'sipping' ? 0 : state === 'ready' ? 1 : 0,
                            opacity: state === 'sipping' ? 0 : 1 
                        }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    {/* Gooey Filter for Grounds */}
                    <div style={{ filter: 'contrast(15)' }} className="w-full h-full bg-white/0 flex items-center justify-center relative">
                        <div className="absolute inset-0 bg-[#0A0A0A] hidden"></div> 
                        
                        {(state === 'reading' || state === 'revealed') && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
                                animate={{ 
                                    opacity: 1, 
                                    scale: 1, 
                                    rotate: state === 'reading' ? 180 : 0
                                }}
                                transition={{ duration: 2 }}
                                className="w-full h-full relative"
                            >
                                {/* Generating Random Blobs */}
                                {blobs.length > 0 ? blobs.map((style, i) => (
                                    <div key={i} className="absolute bg-[#1a1512] dark:bg-black blur-md" style={{
                                        transform: 'translate(-50%, -50%)',
                                        // Use inline styles parsed from string for simplicity in this generated context
                                        width: style.match(/width:\s*(\d+px)/)?.[1],
                                        height: style.match(/height:\s*(\d+px)/)?.[1],
                                        left: style.match(/left:\s*(\d+%)/)?.[1],
                                        top: style.match(/top:\s*(\d+%)/)?.[1],
                                        borderRadius: style.match(/border-radius:\s*([^;]+)/)?.[1],
                                    }}></div>
                                )) : (
                                    /* Loading placeholder blobs */
                                    <>
                                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute top-1/2 left-1/2 w-20 h-20 bg-[#1a1512] dark:bg-black blur-lg rounded-full -translate-x-1/2 -translate-y-1/2"></motion.div>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-24 flex items-center justify-center mb-8">
                <AnimatePresence mode="wait">
                    {state === 'ready' && (
                         <motion.div key="instr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-center">
                            <p className="opacity-50 uppercase tracking-widest text-sm mb-4">{t.instruction}</p>
                        </motion.div>
                    )}
                    {state === 'revealed' && (
                        <motion.div key="pred" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg">
                             <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight text-[#FF3B30]">"{prediction}"</h3>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <button 
                onClick={handleAction} 
                disabled={state === 'sipping' || state === 'reading'}
                className={`
                    px-12 py-6 rounded-full text-xl font-black tracking-widest uppercase shadow-lg transition-all
                    ${state === 'sipping' || state === 'reading' ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-wait' : 'bg-[#FF3B30] text-white hover:scale-105'}
                `}
            >
                {state === 'ready' ? t.btn_sip : state === 'sipping' ? '...' : state === 'reading' ? t.btn_reading : t.btn_retry}
            </button>

        </motion.div>
    );
};

const CartDrawer: React.FC<{ isOpen: boolean; onClose: () => void; items: Product[]; onRemove: (index: number) => void; isDark: boolean; lang: Lang; }> = ({ isOpen, onClose, items, onRemove, isDark, lang }) => {
    const t = CONTENT[lang].cart;
    const theme = isDark ? COLORS.dark : COLORS.light;
    const total = items.reduce((acc, item) => acc + parseFloat(item.price.replace('₾', '')), 0);
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80]" />
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed top-0 right-0 h-full w-full max-w-md z-[90] flex flex-col shadow-2xl" style={{ backgroundColor: theme.base, color: theme.text }}>
                        <div className="p-8 flex justify-between items-center border-b border-current/10"><h2 className="text-2xl font-black uppercase tracking-tighter">{t.title} ({items.length})</h2><button onClick={onClose}><X size={24} /></button></div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {items.length === 0 ? <p className="opacity-40 text-center uppercase font-bold">{t.empty}</p> : items.map((item, index) => (
                                <div key={index} className="flex gap-4"><div className="w-20 h-24 bg-zinc-100 dark:bg-zinc-800 overflow-hidden"><img src={item.img} className="w-full h-full object-cover" /></div><div className="flex-1"><div className="flex justify-between font-bold uppercase"><span>{item.name}</span><button onClick={() => onRemove(index)} className="text-red-500"><Trash2 size={16} /></button></div><PriceDisplay price={item.price} className="font-bold" /></div></div>
                            ))}
                        </div>
                        {items.length > 0 && <div className="p-8 border-t border-current/10"><div className="flex justify-between text-2xl font-black uppercase mb-6"><span>{t.subtotal}</span><PriceDisplay price={`₾${total.toFixed(2)}`} /></div><button className="w-full py-4 bg-[#FF3B30] text-white font-black uppercase tracking-widest">{t.checkout}</button></div>}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState<Lang>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'brand' | 'menu' | 'shop' | 'game' | 'logo' | 'oracle'>('home');
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeDrink, setActiveDrink] = useState<number | null>(null);
  const theme = isDark ? COLORS.dark : COLORS.light;
  const t = CONTENT[lang];
  return (
    <div className={`min-h-screen transition-colors duration-500 selection:bg-[#FF3B30] selection:text-white ${isDark ? 'dark' : ''} ${lang === 'en' ? 'font-en' : 'font-ge'}`} style={{ backgroundColor: theme.base, color: theme.text }}>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex items-center justify-between backdrop-blur-sm">
        <div className="flex-1"><button onClick={() => setIsMenuOpen(true)} className="hover:opacity-60 transition-opacity"><div className="space-y-1"><span className={`block w-5 h-0.5 ${isDark ? 'bg-white' : 'bg-black'}`}></span><span className={`block w-5 h-0.5 ${isDark ? 'bg-white' : 'bg-black'}`}></span></div></button></div>
        <div className="flex-1 flex justify-center"><button onClick={() => setCurrentPage('home')} className="text-xl font-black tracking-tighter uppercase"><span className="text-[#FF3B30]">YAM</span><span className="ml-1.5" style={{ color: isDark ? '#FFFFFF' : '#0A0A0A' }}>COFFEE</span></button></div>
        <div className="flex-1 flex items-center justify-end gap-5">
          <button onClick={() => setLang(l => l === 'en' ? 'ge' : 'en')} className="text-xs font-black tracking-widest uppercase border border-current px-2 py-0.5 rounded hover:bg-[#FF3B30] hover:text-white hover:border-[#FF3B30] transition-all">
            {lang === 'en' ? 'GE' : 'EN'}
          </button>
          <button onClick={() => setIsDark(!isDark)} className="opacity-70 hover:opacity-100 transition-opacity">{isDark ? <Sun size={18} /> : <Moon size={18} />}</button>
          {currentPage === 'shop' && cartItems.length > 0 && <div onClick={() => setIsCartOpen(true)} className="relative cursor-pointer"><ShoppingCart size={20} /><span className="absolute -top-2 -right-2 bg-[#FF3B30] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{cartItems.length}</span></div>}
        </div>
      </nav>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onRemove={(idx) => setCartItems(prev => prev.filter((_, i) => i !== idx))} isDark={isDark} lang={lang} />
      <AnimatePresence>
        {isMenuOpen && (
          <><motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={() => setIsMenuOpen(false)} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60]" /><motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.5, ease: [0.32, 0.72, 0, 1] }} className="fixed top-0 left-0 h-full w-full max-w-sm z-[70] p-12 flex flex-col" style={{ backgroundColor: theme.base }}><button onClick={() => setIsMenuOpen(false)} className="self-end mb-10 p-2"><X size={28} /></button><div className="flex flex-col gap-3">
            {[ { name: t.nav.home, id: 'home' }, { name: t.nav.brand, id: 'brand' }, { name: t.nav.menu, id: 'menu' }, { name: t.nav.shop, id: 'shop' }, { name: t.nav.game, id: 'game' }, { name: t.nav.oracle, id: 'oracle' }, { name: t.nav.logo, id: 'logo' } ].map((item) => (
                <button key={item.id} onClick={() => { setCurrentPage(item.id as any); setIsMenuOpen(false); }} className={`text-[2.7rem] font-black text-left hover:text-[#FF3B30] transition-all tracking-tighter ${currentPage === item.id ? 'text-[#FF3B30]' : ''}`}>{item.name}</button>
            ))}
          </div></motion.div></>
        )}
      </AnimatePresence>
      <main>
        <AnimatePresence mode="wait">
          {currentPage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <section className="pt-44 pb-20 px-6 md:px-12 flex flex-col items-center text-center">
                <span className="text-[#FF3B30] font-bold tracking-[0.2em] text-[10px] mb-8 uppercase">{t.hero.since}</span>
                <h1 className="text-6xl md:text-[7.5rem] lg:text-[9.5rem] font-black leading-[0.9] tracking-tighter mb-12 uppercase">{t.hero.title_1} <br /> {t.hero.title_2} <br /> {t.hero.title_3} <span className="text-[#FF3B30]">YAM.</span></h1>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setCurrentPage('brand')} className="bg-[#FF3B30] text-white px-12 py-5 rounded-full text-sm font-black tracking-widest uppercase shadow-xl">{t.hero.cta}</motion.button>
                <div className="mt-28 w-full max-w-5xl aspect-video rounded-[40px] overflow-hidden shadow-2xl"><img src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover" alt="Coffee" /></div>
              </section>

              <section className="w-full overflow-hidden bg-[#FF3B30] py-5 -rotate-1 scale-[1.02]">
                <div className="flex animate-marquee whitespace-nowrap">
                  {[...Array(2)].map((_, loop) => (
                    <div key={loop} className="flex items-center shrink-0">
                      {(lang === 'en' ? [
                        { text: "ORGANIC SOIL", style: "font-black" },
                        { text: "daily roast", style: "italic font-light" },
                        { text: "FAIR TRADE", style: "font-black tracking-[0.3em]" },
                        { text: "slow mornings", style: "italic font-light" },
                        { text: "NO SHORTCUTS", style: "font-black" },
                        { text: "craft over hype", style: "italic font-light" },
                        { text: "BATUMI", style: "font-black tracking-[0.3em]" },
                        { text: "good beans only", style: "italic font-light" },
                        { text: "EST. 2026", style: "font-black" },
                        { text: "sip the vibe", style: "italic font-light" },
                      ] : [
                        { text: "ორგანული ნიადაგი", style: "font-black" },
                        { text: "ყოველდღიური მოხალვა", style: "italic font-light" },
                        { text: "სამართლიანი ვაჭრობა", style: "font-black tracking-[0.2em]" },
                        { text: "მშვიდი დილა", style: "italic font-light" },
                        { text: "კომპრომისის გარეშე", style: "font-black" },
                        { text: "ხელობა, არა ჰაიპი", style: "italic font-light" },
                        { text: "ბათუმი", style: "font-black tracking-[0.2em]" },
                        { text: "მხოლოდ კარგი მარცვალი", style: "italic font-light" },
                        { text: "2026 წლიდან", style: "font-black" },
                        { text: "იგრძენი ვაიბი", style: "italic font-light" },
                      ]).map((item, i) => (
                        <span key={`${loop}-${i}`} className={`text-white text-lg md:text-2xl mx-6 ${item.style}`}>
                          {item.text}
                          <span className="mx-6 text-white/40 font-normal not-italic">&#x2022;</span>
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
                <style>{`
                  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                  .animate-marquee { animation: marquee 30s linear infinite; display: flex; }
                `}</style>
              </section>

              <section className="py-24 px-6 md:px-12 max-w-4xl mx-auto">
                <h3 className="text-4xl md:text-5xl font-black italic mb-16 uppercase font-en tracking-tighter">
                  {t.home.todays_brew}
                </h3>
                <div className="flex flex-col gap-8">
                  {COFFEE_MENU_DATA[lang].map((item, idx) => (
                    <motion.div 
                        key={idx}
                        onClick={() => setActiveDrink(idx)}
                        className={`flex justify-between items-start pb-6 border-b border-current/10 cursor-pointer transition-colors duration-300 ${activeDrink === idx ? 'text-[#FF3B30]' : 'hover:text-[#FF3B30]'}`}
                    >
                      <div className="flex flex-col gap-1 text-left">
                        <span className="text-[1.7rem] md:text-[2rem] font-black uppercase leading-none">{item.name}</span>
                        <span className="text-sm font-medium opacity-50">{item.desc}</span>
                      </div>
                      <PriceDisplay price={item.price} className="text-[1.35rem] md:text-[1.7rem] font-black" />
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="py-20 px-6 md:px-12">
                 <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                       <h3 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                          {t.home.bring_home} <br/> <span className="text-[#FF3B30]">{t.home.bring_home_accent}</span>
                       </h3>
                       <button 
                          onClick={() => setCurrentPage('shop')}
                          className="hidden md:flex items-center gap-2 font-bold uppercase tracking-widest text-xs hover:text-[#FF3B30] transition-colors"
                       >
                          {t.home.view_apparel} <ArrowUpRight size={16} />
                       </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                       {BEANS_products[lang].map((bean) => (
                          <div key={bean.id} className="group cursor-pointer">
                             <div className="aspect-[3/4] rounded-[30px] overflow-hidden mb-6 relative">
                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors z-10"></div>
                                <motion.img 
                                   whileHover={{ scale: 1.1 }}
                                   transition={{ duration: 0.6 }}
                                   src={bean.img} 
                                   className="w-full h-full object-cover"
                                />
                             </div>
                             <h4 className="text-2xl font-black uppercase mb-1">{bean.name}</h4>
                             <p className="opacity-50 text-sm font-medium tracking-wide uppercase">{bean.note}</p>
                          </div>
                       ))}
                    </div>
                    <button 
                        onClick={() => setCurrentPage('shop')}
                        className="md:hidden mt-10 w-full py-4 border border-current rounded-full font-bold uppercase tracking-widest text-xs"
                    >
                          {t.home.view_apparel}
                   </button>
                 </div>
              </section>

              <section className="py-32 px-6 md:px-12 transition-colors">
                 <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-20">
                    <div className="flex-1">
                       <h3 className="text-6xl md:text-8xl font-black tracking-tighter uppercase mb-8 leading-[0.8]">
                          {t.home.visit} <br/> {t.home.visit_the} <span className="text-transparent stroke-text" style={{ WebkitTextStroke: isDark ? '2px #FFF' : '2px #000' }}>YAM.</span>
                       </h3>
                       <p className="text-xl opacity-60 max-w-md">
                          {t.home.desc_visit}
                       </p>
                    </div>
                    <div className="flex-1 space-y-12">
                       <div className="flex gap-6 items-start">
                          <MapPin className="text-[#FF3B30] shrink-0 mt-1" size={32} />
                          <div>
                             <h4 className="text-2xl font-black uppercase mb-2">{t.home.location_title}</h4>
                             <p className="text-lg opacity-70">{t.home.location_val}<br/>{t.home.location_city}</p>
                          </div>
                       </div>
                       <div className="flex gap-6 items-start">
                          <Clock className="text-[#FF3B30] shrink-0 mt-1" size={32} />
                          <div>
                             <h4 className="text-2xl font-black uppercase mb-2">{t.home.hours_title}</h4>
                             <p className="text-lg opacity-70"> {t.home.hours_week}</p>
                             <p className="text-lg opacity-70"> {t.home.hours_end}</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </section>
            </motion.div>
          )}
          {currentPage === 'brand' && <BrandPage isDark={isDark} lang={lang} />}
          {currentPage === 'menu' && <MenuPage isDark={isDark} lang={lang} />}
          {currentPage === 'shop' && <ShopPage isDark={isDark} addToCart={(p) => setCartItems(prev => [...prev, p])} lang={lang} />}
          {currentPage === 'game' && <GamePage isDark={isDark} lang={lang} />}
          {currentPage === 'oracle' && <OraclePage isDark={isDark} lang={lang} />}
          {currentPage === 'logo' && <LogoPage isDark={isDark} lang={lang} />}
        </AnimatePresence>
      </main>
      <footer className="border-t border-black/5 dark:border-white/5 py-24 px-6 md:px-12 text-center">
        <h2 className="text-[12vw] md:text-[8rem] font-black mb-10 tracking-tighter leading-none opacity-10 hover:opacity-100 transition-opacity duration-700 select-none">YAM COFFEE</h2>
        <div className="flex justify-center gap-10 mb-12"><Instagram size={22} className="opacity-40 hover:opacity-100 hover:text-[#FF3B30]" /></div>
        <p className="text-[9px] font-black opacity-20 tracking-[0.6em] uppercase">{t.footer.rights}</p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);