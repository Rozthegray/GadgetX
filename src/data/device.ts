export type DeviceSpec = {
  name: string;
  brand: string;
  year: number;
  chipset: string;
  gpu: string;
  batteryMah: number;
  chargingW: number;
  displayHz: number;
  cooling: string;
  antutu: number;
  geekbenchSingle: number;
  geekbenchMulti: number;
  codmMP: number;
  codmBR: number;
  pubg: number;
  freeFire: number;
  bloodStrike: number;
  thermalScore: string;
  bugs: string[];
  aliases: string[];
};

export const DEVICES: DeviceSpec[] = [
  // ==========================================
  // 🔴 RED MAGIC SERIES (11 down to 7)
  // ==========================================
  {
    name: "RedMagic 11 Pro Max", brand: "RedMagic", year: 2026, chipset: "Snapdragon 8 Gen 5 / Elite 2", gpu: "Adreno 830", batteryMah: 7000, chargingW: 165, displayHz: 165, cooling: "ICE 15.0 Active Centrifugal Fan", antutu: 3200000, geekbenchSingle: 3400, geekbenchMulti: 10500, codmMP: 144, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 165,
    thermalScore: "Flawless. Active fan prevents all throttling.", bugs: ["BR artificially capped at 90 FPS by dev whitelist."],
    aliases: ["rm11", "red magic 11", "redmagic 11 pro"]
  },
  {
    name: "RedMagic 10 Pro", brand: "RedMagic", year: 2025, chipset: "Snapdragon 8 Elite", gpu: "Adreno 830", batteryMah: 6500, chargingW: 80, displayHz: 144, cooling: "ICE 14.0 Active Fan", antutu: 2800000, geekbenchSingle: 3000, geekbenchMulti: 9500, codmMP: 144, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 144,
    thermalScore: "Excellent. Fan noise is noticeable but effective.", bugs: ["Occasional whitelist drops to 120 FPS in MP after patches."],
    aliases: ["rm10", "red magic 10", "10 pro"]
  },
  {
    name: "RedMagic 9 Pro", brand: "RedMagic", year: 2024, chipset: "Snapdragon 8 Gen 3", gpu: "Adreno 750", batteryMah: 6500, chargingW: 80, displayHz: 120, cooling: "ICE 13.0 Active Fan", antutu: 2270000, geekbenchSingle: 2250, geekbenchMulti: 7100, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Perfect sustained performance.", bugs: ["GameSpace UI localization issues."],
    aliases: ["rm9", "red magic 9"]
  },
  {
    name: "RedMagic 8 Pro", brand: "RedMagic", year: 2023, chipset: "Snapdragon 8 Gen 2", gpu: "Adreno 740", batteryMah: 6000, chargingW: 65, displayHz: 120, cooling: "ICE 11.0 Active Fan", antutu: 1600000, geekbenchSingle: 2000, geekbenchMulti: 5500, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 120, bloodStrike: 120,
    thermalScore: "Great, fan keeps it under 40C.", bugs: ["Touch sampling rate ghosting if screen protector is too thick."],
    aliases: ["rm8", "red magic 8"]
  },
  {
    name: "RedMagic 7 Pro", brand: "RedMagic", year: 2022, chipset: "Snapdragon 8 Gen 1", gpu: "Adreno 730", batteryMah: 5000, chargingW: 65, displayHz: 120, cooling: "ICE 9.0 Active Fan", antutu: 1050000, geekbenchSingle: 1200, geekbenchMulti: 3800, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 90, bloodStrike: 90,
    thermalScore: "Runs very hot due to Gen 1 chip; relies heavily on fan.", bugs: ["Battery degradation common due to age."],
    aliases: ["rm7", "red magic 7"]
  },

  // ==========================================
  // ⚔️ ASUS ROG SERIES (9 down to 5)
  // ==========================================
  {
    name: "ASUS ROG Phone 9 Pro", brand: "Asus", year: 2025, chipset: "Snapdragon 8 Elite", gpu: "Adreno 830", batteryMah: 5800, chargingW: 65, displayHz: 165, cooling: "GameCool 9 (Centered CPU)", antutu: 2850000, geekbenchSingle: 3050, geekbenchMulti: 9600, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 165,
    thermalScore: "Exceptional with AeroActive cooler. Throttles slightly without it.", bugs: ["Missing 144Hz whitelist in CODM despite 165Hz screen."],
    aliases: ["rog 9", "rog phone 9", "asus rog 9"]
  },
  {
    name: "ASUS ROG Phone 8 Pro", brand: "Asus", year: 2024, chipset: "Snapdragon 8 Gen 3", gpu: "Adreno 750", batteryMah: 5500, chargingW: 65, displayHz: 165, cooling: "GameCool 8", antutu: 2300000, geekbenchSingle: 2300, geekbenchMulti: 7200, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 165,
    thermalScore: "Strong, but thinner chassis means hotter hands than ROG 7.", bugs: ["AirTrigger mapping sometimes fails mid-game."],
    aliases: ["rog 8", "rog phone 8"]
  },
  {
    name: "ASUS ROG Phone 7 Ultimate", brand: "Asus", year: 2023, chipset: "Snapdragon 8 Gen 2", gpu: "Adreno 740", batteryMah: 6000, chargingW: 65, displayHz: 165, cooling: "AeroActive Portal (Motorized Vent)", antutu: 1650000, geekbenchSingle: 2050, geekbenchMulti: 5600, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 120, bloodStrike: 120,
    thermalScore: "Best passive cooling of 2023.", bugs: ["Portal vent can get stuck if dusty."],
    aliases: ["rog 7", "rog phone 7"]
  },
  {
    name: "ASUS ROG Phone 6 Pro", brand: "Asus", year: 2022, chipset: "Snapdragon 8+ Gen 1", gpu: "Adreno 730", batteryMah: 6000, chargingW: 65, displayHz: 165, cooling: "GameCool 6", antutu: 1100000, geekbenchSingle: 1300, geekbenchMulti: 4000, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 90, bloodStrike: 90,
    thermalScore: "Runs warm but sustains better than standard Gen 1.", bugs: ["Motherboard bricking issues reported in early batches."],
    aliases: ["rog 6", "rog phone 6"]
  },
  {
    name: "ASUS ROG Phone 5", brand: "Asus", year: 2021, chipset: "Snapdragon 888", gpu: "Adreno 660", batteryMah: 6000, chargingW: 65, displayHz: 144, cooling: "GameCool 5", antutu: 800000, geekbenchSingle: 1100, geekbenchMulti: 3500, codmMP: 90, codmBR: 60, pubg: 90, freeFire: 90, bloodStrike: 60,
    thermalScore: "Snapdragon 888 runs infamously hot. Severe throttling.", bugs: ["Wifi chip burnout due to extreme heat."],
    aliases: ["rog 5", "rog phone 5"]
  },

  // ==========================================
  // 🍎 APPLE iPHONE (17 down to 6)
  // ==========================================
  {
    name: "iPhone 17 Pro Max", brand: "Apple", year: 2025, chipset: "Apple A19 Pro", gpu: "7-Core Apple GPU", batteryMah: 4800, chargingW: 35, displayHz: 120, cooling: "Graphene Sheet + Metal Shell", antutu: 2100000, geekbenchSingle: 3400, geekbenchMulti: 9000, codmMP: 120, codmBR: 120, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Highly efficient. Rarely dims under normal load.", bugs: ["None reported."],
    aliases: ["iphone 17", "iphone 17 pro max", "17 pro max"]
  },
  {
    name: "iPhone 16 Pro Max", brand: "Apple", year: 2024, chipset: "Apple A18 Pro", gpu: "6-Core Apple GPU", batteryMah: 4676, chargingW: 30, displayHz: 120, cooling: "Graphene Substrate", antutu: 1850000, geekbenchSingle: 3100, geekbenchMulti: 8200, codmMP: 120, codmBR: 120, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Better sustained performance than 15 Pro.", bugs: ["iOS Game Mode occasionally conflicts with screen recording."],
    aliases: ["iphone 16", "16 pro max", "iphone 16 pm"]
  },
  {
    name: "iPhone 15 Pro Max", brand: "Apple", year: 2023, chipset: "Apple A17 Pro", gpu: "6-Core Apple GPU", batteryMah: 4422, chargingW: 27, displayHz: 120, cooling: "Graphite pad (Passive)", antutu: 1640000, geekbenchSingle: 2900, geekbenchMulti: 7200, codmMP: 120, codmBR: 120, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Fair. Rapid heat buildup causes screen auto-dimming.", bugs: ["Aggressive iOS screen dimming during heavy thermal load."],
    aliases: ["iphone 15", "15 pro max", "15 pm"]
  },
  {
    name: "iPhone 14 Pro Max", brand: "Apple", year: 2022, chipset: "Apple A16 Bionic", gpu: "5-Core Apple GPU", batteryMah: 4323, chargingW: 27, displayHz: 120, cooling: "Standard Graphite", antutu: 1450000, geekbenchSingle: 2500, geekbenchMulti: 6400, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 90, bloodStrike: 90,
    thermalScore: "Solid, but drops to 60fps when hot.", bugs: ["Screen dimming."],
    aliases: ["iphone 14", "14 pro max"]
  },
  {
    name: "iPhone 13 Pro Max", brand: "Apple", year: 2021, chipset: "Apple A15 Bionic", gpu: "5-Core Apple GPU", batteryMah: 4352, chargingW: 27, displayHz: 120, cooling: "Standard Graphite", antutu: 1300000, geekbenchSingle: 2300, geekbenchMulti: 5800, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 90, bloodStrike: 90,
    thermalScore: "Legendary battery, but ages fast under heavy load.", bugs: ["Lightning port wear. Battery health drops below 80% quickly now."],
    aliases: ["iphone 13", "13 pro max"]
  },
  {
    name: "iPhone 11 Pro Max", brand: "Apple", year: 2019, chipset: "Apple A13 Bionic", gpu: "4-Core Apple GPU", batteryMah: 3969, chargingW: 18, displayHz: 60, cooling: "Standard", antutu: 800000, geekbenchSingle: 1300, geekbenchMulti: 3300, codmMP: 60, codmBR: 60, pubg: 60, freeFire: 60, bloodStrike: 60,
    thermalScore: "Severe throttling on modern games.", bugs: ["Obsolete hardware for competitive play."],
    aliases: ["iphone 11", "11 pro max"]
  },
  {
    name: "iPhone 8 Plus", brand: "Apple", year: 2017, chipset: "Apple A11 Bionic", gpu: "3-Core", batteryMah: 2691, chargingW: 15, displayHz: 60, cooling: "None", antutu: 400000, geekbenchSingle: 900, geekbenchMulti: 2300, codmMP: 60, codmBR: 40, pubg: 40, freeFire: 60, bloodStrike: 40,
    thermalScore: "Melts on modern titles.", bugs: ["Frame drops, extreme battery drain."],
    aliases: ["iphone 8", "8 plus"]
  },
  {
    name: "iPhone 6s Plus", brand: "Apple", year: 2015, chipset: "Apple A9", gpu: "PowerVR GT7600", batteryMah: 2750, chargingW: 10, displayHz: 60, cooling: "None", antutu: 250000, geekbenchSingle: 500, geekbenchMulti: 1000, codmMP: 30, codmBR: 30, pubg: 30, freeFire: 30, bloodStrike: 30,
    thermalScore: "Unplayable for esports.", bugs: ["Crashing on launch for heavy games."],
    aliases: ["iphone 6", "6s plus"]
  },

  // ==========================================
  // 📱 APPLE iPADS (M5 down to A13)
  // ==========================================
  {
    name: "iPad Pro 13-inch (M5)", brand: "Apple", year: 2025, chipset: "Apple M5", gpu: "10-Core Apple GPU", batteryMah: 10500, chargingW: 45, displayHz: 120, cooling: "Copper frame logo", antutu: 2800000, geekbenchSingle: 3800, geekbenchMulti: 14000, codmMP: 120, codmBR: 120, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "God-tier. Does not break a sweat.", bugs: ["None."],
    aliases: ["ipad pro m5", "m5 ipad"]
  },
  {
    name: "iPad Pro 13-inch (M4)", brand: "Apple", year: 2024, chipset: "Apple M4", gpu: "10-Core Apple GPU", batteryMah: 10290, chargingW: 40, displayHz: 120, cooling: "Copper Apple Logo sink", antutu: 2500000, geekbenchSingle: 3600, geekbenchMulti: 13000, codmMP: 120, codmBR: 120, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Flawless.", bugs: ["Extremely thin chassis can bend if gripped too hard."],
    aliases: ["ipad pro m4", "m4 ipad"]
  },
  {
    name: "iPad Pro 12.9-inch (M2)", brand: "Apple", year: 2022, chipset: "Apple M2", gpu: "10-Core", batteryMah: 10758, chargingW: 35, displayHz: 120, cooling: "Aluminum chassis", antutu: 2000000, geekbenchSingle: 2500, geekbenchMulti: 9500, codmMP: 120, codmBR: 120, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Excellent.", bugs: ["Mini-LED blooming."],
    aliases: ["ipad pro m2", "m2 ipad"]
  },
  {
    name: "iPad Pro 11-inch (M1)", brand: "Apple", year: 2021, chipset: "Apple M1", gpu: "8-Core", batteryMah: 7538, chargingW: 30, displayHz: 120, cooling: "Aluminum", antutu: 1700000, geekbenchSingle: 2300, geekbenchMulti: 8000, codmMP: 120, codmBR: 120, pubg: 90, freeFire: 120, bloodStrike: 120,
    thermalScore: "Still a competitive monster.", bugs: ["Battery drains faster on newer games."],
    aliases: ["ipad pro m1", "m1 ipad"]
  },
  {
    name: "iPad 10th Gen", brand: "Apple", year: 2022, chipset: "Apple A14 Bionic", gpu: "4-Core", batteryMah: 7606, chargingW: 20, displayHz: 60, cooling: "Passive", antutu: 1000000, geekbenchSingle: 1600, geekbenchMulti: 4100, codmMP: 60, codmBR: 60, pubg: 60, freeFire: 60, bloodStrike: 60,
    thermalScore: "Average. Non-laminated screen.", bugs: ["Screen gap makes tap registration feel hollow."],
    aliases: ["ipad 10", "ipad a14"]
  },

  // ==========================================
  // ⚡ POCO & XIAOMI (X, F, GT series)
  // ==========================================
  {
    name: "Poco F8 Pro", brand: "Poco", year: 2026, chipset: "Snapdragon 8 Elite", gpu: "Adreno 830", batteryMah: 6210, chargingW: 120, displayHz: 120, cooling: "IceLoop Liquid Cooling", antutu: 2750000, geekbenchSingle: 3000, geekbenchMulti: 9400, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Incredible value for sustained performance.", bugs: ["MIUI/HyperOS bloatware slows down UI."],
    aliases: ["poco f8", "f8 pro"]
  },
  {
    name: "Poco F7 Pro", brand: "Poco", year: 2025, chipset: "Snapdragon 8 Gen 3", gpu: "Adreno 750", batteryMah: 5500, chargingW: 120, displayHz: 120, cooling: "IceLoop Liquid Cooling", antutu: 2150000, geekbenchSingle: 2200, geekbenchMulti: 6800, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Very solid. Budget king of 2025.", bugs: ["Aggressive background app killing."],
    aliases: ["poco f7", "f7 pro"]
  },
  {
    name: "Poco X6 Pro", brand: "Poco", year: 2024, chipset: "MediaTek Dimensity 8300 Ultra", gpu: "Mali G615-MC6", batteryMah: 5000, chargingW: 67, displayHz: 120, cooling: "5000mm² Stainless Steel VC", antutu: 1464228, geekbenchSingle: 1400, geekbenchMulti: 4300, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 120, bloodStrike: 120,
    thermalScore: "Gets very warm during 120FPS gaming.", bugs: ["120 FPS option sometimes disappears from CODM menus."],
    aliases: ["poco x6", "x6 pro"]
  },
  {
    name: "Poco F5", brand: "Poco", year: 2023, chipset: "Snapdragon 7+ Gen 2", gpu: "Adreno 725", batteryMah: 5000, chargingW: 67, displayHz: 120, cooling: "LiquidCool 2.0", antutu: 1100000, geekbenchSingle: 1600, geekbenchMulti: 4200, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 90, bloodStrike: 90,
    thermalScore: "Best midrange thermal efficiency.", bugs: ["Plastic back retains heat."],
    aliases: ["poco f5"]
  },
  {
    name: "Poco X4 GT", brand: "Poco", year: 2022, chipset: "MediaTek Dimensity 8100", gpu: "Mali-G610 MC6", batteryMah: 5080, chargingW: 67, displayHz: 144, cooling: "LiquidCool 2.0", antutu: 800000, geekbenchSingle: 900, geekbenchMulti: 3600, codmMP: 90, codmBR: 90, pubg: 90, freeFire: 90, bloodStrike: 90,
    thermalScore: "LCD screen prevents burn-in but generates more heat.", bugs: ["LCD screen response time is slower than OLED."],
    aliases: ["x4 gt", "poco x4"]
  },

  // ==========================================
  // 🔵 VIVO & iQOO (Z and Neo series 8-15)
  // ==========================================
  {
    name: "iQOO 15 Pro", brand: "Vivo", year: 2026, chipset: "Snapdragon 8 Gen 5 / Elite 2", gpu: "Adreno 830", batteryMah: 6000, chargingW: 120, displayHz: 144, cooling: "Dual VC Liquid Cooling", antutu: 3100000, geekbenchSingle: 3300, geekbenchMulti: 10000, codmMP: 144, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 144,
    thermalScore: "Incredible. Dedicated Q2 display chip shares GPU load.", bugs: ["Frame interpolation causes input lag for pro players."],
    aliases: ["iqoo 15", "vivo iqoo 15"]
  },
  {
    name: "iQOO Neo 10 Pro", brand: "Vivo", year: 2025, chipset: "MediaTek Dimensity 9400+", gpu: "Immortalis-G920", batteryMah: 5500, chargingW: 120, displayHz: 144, cooling: "6K VC Liquid Cooling", antutu: 2850000, geekbenchSingle: 2900, geekbenchMulti: 9200, codmMP: 144, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Extremely stable. Dimensity dominates here.", bugs: ["Funtouch OS notifications interrupt gameplay."],
    aliases: ["neo 10", "iqoo neo 10"]
  },
  {
    name: "iQOO 12", brand: "Vivo", year: 2023, chipset: "Snapdragon 8 Gen 3", gpu: "Adreno 750", batteryMah: 5000, chargingW: 120, displayHz: 144, cooling: "6K VC Four-Zone", antutu: 2100000, geekbenchSingle: 2200, geekbenchMulti: 6800, codmMP: 144, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 144,
    thermalScore: "Great, but gets warm during 144fps.", bugs: ["None."],
    aliases: ["iqoo 12"]
  },
  {
    name: "iQOO Neo 8 Pro", brand: "Vivo", year: 2023, chipset: "MediaTek Dimensity 9200+", gpu: "Immortalis-G715", batteryMah: 5000, chargingW: 120, displayHz: 144, cooling: "5K VC", antutu: 1550000, geekbenchSingle: 1800, geekbenchMulti: 5000, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 120, bloodStrike: 90,
    thermalScore: "Solid budget performer.", bugs: ["Aggressive thermal throttling down to 60fps after 45 mins."],
    aliases: ["neo 8", "iqoo 8"]
  },
  {
    name: "iQOO Z9 Turbo", brand: "Vivo", year: 2024, chipset: "Snapdragon 8s Gen 3", gpu: "Adreno 735", batteryMah: 6000, chargingW: 80, displayHz: 144, cooling: "Standard VC", antutu: 1500000, geekbenchSingle: 1900, geekbenchMulti: 5200, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 120, bloodStrike: 120,
    thermalScore: "Massive battery prevents deep heat cycling.", bugs: ["Screen brightness limits under heat."],
    aliases: ["iqoo z9", "z9 turbo"]
  },

  // ==========================================
  // ➕ ONEPLUS (Ace 6 down to 1 & Nord)
  // ==========================================
  {
    name: "OnePlus Ace 6 Pro", brand: "OnePlus", year: 2026, chipset: "Snapdragon 8 Elite", gpu: "Adreno 830", batteryMah: 6100, chargingW: 100, displayHz: 120, cooling: "Tiangong Cooling System", antutu: 2750000, geekbenchSingle: 3000, geekbenchMulti: 9400, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Exceptional heat dissipation.", bugs: ["OxygenOS battery optimization drops FPS if not manually disabled."],
    aliases: ["ace 6", "oneplus 14r"]
  },
  {
    name: "OnePlus Ace 3 Pro", brand: "OnePlus", year: 2024, chipset: "Snapdragon 8 Gen 3", gpu: "Adreno 750", batteryMah: 6100, chargingW: 100, displayHz: 120, cooling: "Glacier Battery & VC", antutu: 2300000, geekbenchSingle: 2200, geekbenchMulti: 7000, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Very stable, dense battery tech absorbs heat.", bugs: ["Edge touches rejected due to curved screen."],
    aliases: ["ace 3", "oneplus 12r"]
  },
  {
    name: "OnePlus Nord 4", brand: "OnePlus", year: 2024, chipset: "Snapdragon 7+ Gen 3", gpu: "Adreno 732", batteryMah: 5500, chargingW: 100, displayHz: 120, cooling: "Metal Unibody", antutu: 1400000, geekbenchSingle: 1800, geekbenchMulti: 4800, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 90, bloodStrike: 90,
    thermalScore: "Metal body gets very hot to the touch quickly.", bugs: ["Metal back conducts heat straight to fingers."],
    aliases: ["nord 4", "oneplus nord"]
  },

  // ==========================================
  // 🌌 SAMSUNG (S, A, Flip, Fold)
  // ==========================================
  {
    name: "Samsung Galaxy S25 Ultra", brand: "Samsung", year: 2025, chipset: "Snapdragon 8 Elite", gpu: "Adreno 830", batteryMah: 5000, chargingW: 45, displayHz: 120, cooling: "Large Vapor Chamber", antutu: 2700000, geekbenchSingle: 3100, geekbenchMulti: 9500, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Greatly improved VC. GOS still throttles slightly.", bugs: ["Game Optimization Service (GOS) ruins frame pacing."],
    aliases: ["s25 ultra", "samsung s25"]
  },
  {
    name: "Samsung Galaxy Z Fold 6", brand: "Samsung", year: 2024, chipset: "Snapdragon 8 Gen 3", gpu: "Adreno 750", batteryMah: 4400, chargingW: 25, displayHz: 120, cooling: "Graphite (Poor)", antutu: 2100000, geekbenchSingle: 2200, geekbenchMulti: 6800, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 90, bloodStrike: 90,
    thermalScore: "Terrible. Folding mechanism restricts cooling.", bugs: ["Crease interrupts swiping. Screen too delicate for claw grip."],
    aliases: ["fold 6", "z fold 6"]
  },
  {
    name: "Samsung Galaxy A55", brand: "Samsung", year: 2024, chipset: "Exynos 1480", gpu: "Xclipse 530", batteryMah: 5000, chargingW: 25, displayHz: 120, cooling: "Basic", antutu: 700000, geekbenchSingle: 1100, geekbenchMulti: 3400, codmMP: 60, codmBR: 60, pubg: 60, freeFire: 60, bloodStrike: 60,
    thermalScore: "Not designed for gaming. Gets hot fast.", bugs: ["Exynos chip lags heavily in BR environments."],
    aliases: ["a55", "samsung a55"]
  },

  // ==========================================
  // 📱 ANDROID GAMING TABLETS
  // ==========================================
  {
    name: "RedMagic Nova Gaming Tablet", brand: "RedMagic", year: 2024, chipset: "Snapdragon 8 Gen 3 Leading Version", gpu: "Adreno 750", batteryMah: 10100, chargingW: 120, displayHz: 144, cooling: "20,000 RPM Internal Fan + 3D Heat Pipe", antutu: 2350000, geekbenchSingle: 2350, geekbenchMulti: 7300, codmMP: 144, codmBR: 120, pubg: 120, freeFire: 120, bloodStrike: 144,
    thermalScore: "The only Android tablet with a fan. Absolute zero throttling.", bugs: ["Heavy. Hard to hold for long sessions without a stand."],
    aliases: ["nova tablet", "red magic nova", "nova tab"]
  },
  {
    name: "RedMagic Astra", brand: "RedMagic", year: 2025, chipset: "Snapdragon 8 Elite", gpu: "Adreno 830", batteryMah: 10500, chargingW: 120, displayHz: 144, cooling: "Dual Fan ICE Cooling", antutu: 3000000, geekbenchSingle: 3200, geekbenchMulti: 9800, codmMP: 144, codmBR: 120, pubg: 120, freeFire: 120, bloodStrike: 144,
    thermalScore: "God-tier Android tablet.", bugs: ["Software updates are slow."],
    aliases: ["astra", "red magic astra"]
  },
  {
    name: "Xiaomi Pad 7 Pro", brand: "Xiaomi", year: 2025, chipset: "Snapdragon 8 Gen 3", gpu: "Adreno 750", batteryMah: 10000, chargingW: 120, displayHz: 144, cooling: "Large Graphite", antutu: 2200000, geekbenchSingle: 2200, geekbenchMulti: 7000, codmMP: 144, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Excellent passive cooling.", bugs: ["HyperOS limits background apps aggressively."],
    aliases: ["mi pad 7", "xiaomi pad 7 pro"]
  },

  // ==========================================
  // 🟢 INFINIX, GOOGLE, HONOR
  // ==========================================
  {
    name: "Infinix GT 20 Pro", brand: "Infinix", year: 2024, chipset: "MediaTek Dimensity 8200 Ultimate", gpu: "Mali-G610 MC6", batteryMah: 5000, chargingW: 45, displayHz: 144, cooling: "VC Liquid Cooling", antutu: 950000, geekbenchSingle: 1200, geekbenchMulti: 3800, codmMP: 120, codmBR: 90, pubg: 90, freeFire: 120, bloodStrike: 90,
    thermalScore: "Good budget thermal. Dedicated gaming chip helps.", bugs: ["Touch sampling rate feels sluggish compared to Xiaomi."],
    aliases: ["infinix gt", "gt 20 pro"]
  },
  {
    name: "Google Pixel 9 Pro XL", brand: "Google", year: 2024, chipset: "Tensor G4", gpu: "Mali-G715", batteryMah: 5060, chargingW: 37, displayHz: 120, cooling: "Vapor Chamber", antutu: 1300000, geekbenchSingle: 1900, geekbenchMulti: 4700, codmMP: 90, codmBR: 60, pubg: 60, freeFire: 90, bloodStrike: 60,
    thermalScore: "Tensor G4 is not meant for gaming. Gets hot fast.", bugs: ["Severe frame drops in BR. Tensor chips are AI-focused, not gaming-focused."],
    aliases: ["pixel 9", "pixel 9 pro xl", "google pixel"]
  },
  {
    name: "Honor Magic 7 Pro", brand: "Honor", year: 2025, chipset: "Snapdragon 8 Elite", gpu: "Adreno 830", batteryMah: 5800, chargingW: 100, displayHz: 120, cooling: "Bionic VC", antutu: 2800000, geekbenchSingle: 3100, geekbenchMulti: 9500, codmMP: 120, codmBR: 90, pubg: 120, freeFire: 120, bloodStrike: 120,
    thermalScore: "Superb heat management.", bugs: ["Curved screen edge touches."],
    aliases: ["honor magic 7", "magic 7 pro"]
  }
];