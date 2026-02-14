# YAM Coffee - Local Images

## Structure

```
/public/images/
│
├── hero/
│   └── hero-1.jpg              ← Main page background (16:9)
│
├── gallery/
│   ├── coffee-1.jpg            ← Gallery on YAM Book page (1:1 square)
│   ├── coffee-2.jpg
│   ├── coffee-3.jpg
│   ├── coffee-4.jpg
│   ├── coffee-5.jpg
│   ├── coffee-6.jpg
│   ├── team-1.jpg              ← Team/Photography section (4:5)
│   ├── team-2.jpg
│   └── team-3.jpg
│
├── drinks/
│   ├── drink-1.jpg             ← YAM SPECIAL (3:4)
│   ├── drink-2.jpg             ← SILKY FLAT WHITE
│   └── drink-3.jpg             ← BATCH BREW
│
├── shop/
│   ├── shop-101.jpg            ← YAM ARCHIVE TEE (3:4)
│   ├── shop-102.jpg            ← ABSTRACT NOIR
│   ├── shop-103.jpg            ← YAM HOODIE
│   └── shop-104.jpg            ← CANVAS TOTE
│
└── brand/
    └── brand-1.jpg             ← Brand section image (4:5)
```

## How to Replace Placeholder Images

1. **Replace files** - Simply replace the placeholder files with your real images
2. **Keep the same filenames** - The code references these exact filenames
3. **Recommended formats**: JPG or WebP for photos
4. **Optimize images** before uploading (recommended max 500KB per file)

## Recommended Dimensions

| Section | Ratio | Recommended Size |
|---------|-------|------------------|
| Hero | 16:9 | 1400x800 px |
| Gallery (coffee) | 1:1 | 800x800 px |
| Gallery (team) | 4:5 | 800x1000 px |
| Drinks | 3:4 | 600x800 px |
| Shop | 3:4 | 600x800 px |
| Brand | 4:5 | 960x1200 px |

## Notes

- Placeholder images show "SECTION NAME" text until you replace them
- For drinks and shop items managed via Firebase Admin panel, uploaded images will override local fallbacks
- Local images work offline and load faster than Firebase Storage
