import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding MENZPLAZA database...");

  // 1. Clean existing records
  await prisma.returnRequest.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();
  await prisma.storeSetting.deleteMany();

  // 2. Store Settings
  await prisma.storeSetting.create({
    data: {
      id: "GENERAL",
      announcementText:
        "Complimentary Express Shipping on Orders Over ₹1,499 | Handcrafted Indian Fit Guarantee",
      freeShippingThreshold: 1499,
      standardShippingFee: 99,
      taxRatePercentage: 5.0,
      codEnabled: true,
    },
  });

  // 3. Users
  const adminPasswordHash = await bcrypt.hash("Admin@Menzplaza2025!", 10);
  const admin = await prisma.user.create({
    data: {
      name: "Menzplaza Admin",
      email: "admin@menzplaza.com",
      passwordHash: adminPasswordHash,
      phone: "+919876543210",
      role: "ADMIN",
    },
  });

  const customerPasswordHash = await bcrypt.hash("Customer@123!", 10);
  const customer = await prisma.user.create({
    data: {
      name: "Rahul Sharma",
      email: "rahul.sharma@example.com",
      passwordHash: customerPasswordHash,
      phone: "+919812345678",
      role: "CUSTOMER",
      addresses: {
        create: [
          {
            fullName: "Rahul Sharma",
            phone: "+919812345678",
            addressLine1: "Tower B, Flat 402, Green Glen Layout",
            addressLine2: "Bellandur Outer Ring Road",
            landmark: "Near EcoSpace Tech Park",
            city: "Bengaluru",
            state: "Karnataka",
            postalCode: "560103",
            isDefault: true,
          },
        ],
      },
    },
  });

  // 4. Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: "WELCOME10",
        description: "10% off on your first order with MENZPLAZA",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minOrderValue: 999,
        maxDiscount: 500,
        isActive: true,
      },
      {
        code: "MENZ500",
        description: "Flat ₹500 off on premium trousers over ₹2,999",
        discountType: "FLAT",
        discountValue: 500,
        minOrderValue: 2999,
        isActive: true,
      },
      {
        code: "FESTIVE20",
        description: "20% festive discount on all formal collections",
        discountType: "PERCENTAGE",
        discountValue: 20,
        minOrderValue: 1999,
        maxDiscount: 1000,
        isActive: true,
      },
    ],
  });

  // 5. Categories
  const categoriesData = [
    {
      name: "Formal Pants",
      slug: "formal-pants",
      description: "Tailored boardroom elegance with crease-retention weave and flex waistband.",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
      displayOrder: 1,
    },
    {
      name: "Chinos",
      slug: "chinos",
      description: "Smart casual all-day comfort woven from long-staple combed cotton twill.",
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
      displayOrder: 2,
    },
    {
      name: "Cargo Pants",
      slug: "cargo-pants",
      description: "Functional utility meets refined urban silhouette with reinforced ripstop.",
      image: "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80",
      displayOrder: 3,
    },
    {
      name: "Jeans",
      slug: "jeans",
      description: "Artisanal selvedge and premium ring-spun denim with authentic wash depth.",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
      displayOrder: 4,
    },
    {
      name: "Joggers",
      slug: "joggers",
      description: "Athletic luxury constructed from breathable French terry with tailored ankles.",
      image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=800&q=80",
      displayOrder: 5,
    },
    {
      name: "Casual Trousers",
      slug: "casual-trousers",
      description: "Effortless weekend style with relaxed drape and versatile neutral tones.",
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
      displayOrder: 6,
    },
    {
      name: "Linen Pants",
      slug: "linen-pants",
      description: "Airy 100% pure European linen trousers built for tropical and summer ease.",
      image: "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80",
      displayOrder: 7,
    },
    {
      name: "Slim-Fit Pants",
      slug: "slim-fit-pants",
      description: "Modern streamlined cut with contour stretch designed to flatter.",
      image: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80",
      displayOrder: 8,
    },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categoriesData) {
    const record = await prisma.category.create({
      data: cat,
    });
    createdCategories[cat.slug] = record.id;
  }

  // 6. Products & Variants
  const productsData = [
    {
      name: "The Viceroy Italian Wool-Blend Trouser",
      slug: "the-viceroy-italian-wool-blend-trouser",
      categorySlug: "formal-pants",
      description:
        "Engineered for high-stakes presentations and formal evenings, The Viceroy blends premium Merino wool with whisper-soft micro-stretch. Features a shirt-gripper interior waistband, hidden coin pocket, and pristine permanent crease treatment.",
      fabricCare: "Dry clean only. Warm iron with press cloth if needed.",
      materialComposition: "70% Australian Merino Wool, 28% Poly-twill, 2% Elastane",
      regularPrice: 3499,
      salePrice: 2899,
      fitType: "tapered",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 38,
      images: [
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: [
        { name: "Obsidian Black", hex: "#171717" },
        { name: "Charcoal Slate", hex: "#363839" },
        { name: "Royal Navy", hex: "#1B2A4A" },
      ],
    },
    {
      name: "Verona Smart Flex Stretch Chino",
      slug: "verona-smart-flex-stretch-chino",
      categorySlug: "chinos",
      description:
        "The ultimate wardrobe cornerstone. Cut from 280 GSM peach-finish cotton twill with dynamic 4-way mechanical stretch. Tailored through the seat and slightly tapered from knee to hem for a sleek modern stance.",
      fabricCare: "Machine wash cold inside out. Tumble dry low. Do not bleach.",
      materialComposition: "98% Combed Compact Cotton, 2% Spandex",
      regularPrice: 2499,
      salePrice: 1999,
      fitType: "slim",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: true,
      rating: 4.8,
      reviewCount: 64,
      images: [
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: [
        { name: "Sand Khaki", hex: "#D8C8B5" },
        { name: "Muted Olive", hex: "#666B50" },
        { name: "Deep Navy", hex: "#1F2937" },
      ],
    },
    {
      name: "Tactical Recon Heavyweight Cargo",
      slug: "tactical-recon-heavyweight-cargo",
      categorySlug: "cargo-pants",
      description:
        "Built for utility without the bulk. Reinforced diamond gusset crotch, six ergonomic secure pockets, magnetic flap closures, and bar-tacked stress points. Garment-dyed for vintage richness.",
      fabricCare: "Machine wash delicate. Hang dry in shade.",
      materialComposition: "100% High-Density Cotton Ripstop",
      regularPrice: 2999,
      salePrice: 2399,
      fitType: "relaxed",
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      rating: 4.7,
      reviewCount: 22,
      images: [
        "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: [
        { name: "Muted Olive", hex: "#666B50" },
        { name: "Obsidian Black", hex: "#171717" },
        { name: "Desert Sand", hex: "#C7B299" },
      ],
    },
    {
      name: "Kuroki Selvedge Tapered Denim Jeans",
      slug: "kuroki-selvedge-tapered-denim-jeans",
      categorySlug: "jeans",
      description:
        "Woven on vintage shuttle looms using 13.5 oz red-line selvedge denim. Rich indigo rope dye that develops a unique patina personalized to your lifestyle over time. Finished with custom brass hardware.",
      fabricCare: "Wash inside out in cold water after 3-6 months of initial wear. Air dry flat.",
      materialComposition: "99% Ring-Spun Cotton, 1% Comfort Stretch",
      regularPrice: 3999,
      salePrice: 3199,
      fitType: "tapered",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      rating: 4.9,
      reviewCount: 51,
      images: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: [
        { name: "Raw Indigo", hex: "#1A2E40" },
        { name: "Faded Stonewash", hex: "#5B7C99" },
        { name: "Washed Black", hex: "#2B2B2B" },
      ],
    },
    {
      name: "Amalfi Pure European Linen Trouser",
      slug: "amalfi-pure-european-linen-trouser",
      categorySlug: "linen-pants",
      description:
        "Tailored from 100% Belgian flax linen that breathes effortlessly in the warmest climates. Designed with an extended tab waistband, pleated front, and subtle side adjusters for a bespoke fit without a belt.",
      fabricCare: "Hand wash or gentle cold cycle. Line dry. Steam press while slightly damp.",
      materialComposition: "100% European Flax Certified Linen",
      regularPrice: 3299,
      salePrice: 2699,
      fitType: "regular",
      isFeatured: true,
      isBestseller: false,
      isNewArrival: true,
      rating: 4.8,
      reviewCount: 19,
      images: [
        "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: [
        { name: "Natural Ivory", hex: "#F5F2EB" },
        { name: "Coastal Sand", hex: "#D8C8B5" },
        { name: "Sage Olive", hex: "#7E8568" },
      ],
    },
    {
      name: "Apex Luxury French Terry Commuter Jogger",
      slug: "apex-luxury-french-terry-commuter-jogger",
      categorySlug: "joggers",
      description:
        "A bridge between loungewear softness and tailored city refinement. Featuring 340 GSM organic loopback cotton, zippered concealed passport pocket, tonal drawstrings with gunmetal aglets, and structured ribbed cuffs.",
      fabricCare: "Machine wash cold with like colors. Do not tumble dry.",
      materialComposition: "95% Organic Combed Cotton, 5% Lycra",
      regularPrice: 2299,
      salePrice: 1799,
      fitType: "slim",
      isFeatured: false,
      isBestseller: true,
      isNewArrival: false,
      rating: 4.7,
      reviewCount: 43,
      images: [
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: [
        { name: "Obsidian Black", hex: "#171717" },
        { name: "Melange Grey", hex: "#8A8D8F" },
        { name: "Deep Navy", hex: "#1C2434" },
      ],
    },
    {
      name: "Mayfair Executive Wool Flannel Pant",
      slug: "mayfair-executive-wool-flannel-pant",
      categorySlug: "formal-pants",
      description:
        "Classic British tailoring meets tropical year-round weight. Brushed flannel texture with subtle self-stripe weave. Fully lined to the knee for superior frictionless stride and day-long drape.",
      fabricCare: "Specialist dry clean only.",
      materialComposition: "60% Virgin Wool, 38% Polyester, 2% Elastane",
      regularPrice: 3699,
      salePrice: 2999,
      fitType: "regular",
      isFeatured: false,
      isBestseller: false,
      isNewArrival: true,
      rating: 4.9,
      reviewCount: 15,
      images: [
        "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: [
        { name: "Charcoal Slate", hex: "#333333" },
        { name: "Navy Herringbone", hex: "#1B2838" },
      ],
    },
    {
      name: "Sienna Contour Ultra-Slim Stretch Trouser",
      slug: "sienna-contour-ultra-slim-stretch-trouser",
      categorySlug: "slim-fit-pants",
      description:
        "Precision-engineered for a clean, sharp aesthetic. 360-degree stretch fabric retains its crisp shape from morning meetings to evening dinners without knee-bagging or wrinkling.",
      fabricCare: "Machine wash cold, delicate cycle. Hang dry.",
      materialComposition: "68% Rayon, 28% Nylon, 4% Spandex",
      regularPrice: 2699,
      salePrice: 2199,
      fitType: "slim",
      isFeatured: true,
      isBestseller: true,
      isNewArrival: false,
      rating: 4.8,
      reviewCount: 47,
      images: [
        "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1000&q=80",
      ],
      colors: [
        { name: "Obsidian Black", hex: "#171717" },
        { name: "Khaki Tan", hex: "#B8A38E" },
        { name: "Midnight Blue", hex: "#162032" },
      ],
    },
  ];

  const waistSizes = [28, 30, 32, 34, 36, 38];
  const inseams = [30, 32, 34];

  for (const p of productsData) {
    const categoryId = createdCategories[p.categorySlug];
    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: p.slug,
        categoryId,
        description: p.description,
        fabricCare: p.fabricCare,
        materialComposition: p.materialComposition,
        regularPrice: p.regularPrice,
        salePrice: p.salePrice,
        fitType: p.fitType,
        isFeatured: p.isFeatured,
        isBestseller: p.isBestseller,
        isNewArrival: p.isNewArrival,
        rating: p.rating,
        reviewCount: p.reviewCount,
        images: {
          create: p.images.map((url, idx) => ({
            url,
            altText: `${p.name} - View ${idx + 1}`,
            displayOrder: idx + 1,
            isPrimary: idx === 0,
          })),
        },
      },
    });

    // Create realistic variants (color x waist x inseam)
    const variantsToCreate = [];
    for (const color of p.colors) {
      for (const waist of waistSizes) {
        for (const inseam of inseams) {
          const colorCode = color.name.substring(0, 3).toUpperCase();
          const sku = `MZ-${p.slug.substring(0, 4).toUpperCase()}-${colorCode}-${waist}x${inseam}`;
          variantsToCreate.push({
            productId: product.id,
            colorName: color.name,
            colorHex: color.hex,
            waistSize: waist,
            inseamLength: inseam,
            sku,
            stockQuantity: 15,
          });
        }
      }
    }

    await prisma.productVariant.createMany({
      data: variantsToCreate,
    });

    // Seed realistic reviews
    await prisma.review.createMany({
      data: [
        {
          productId: product.id,
          userId: customer.id,
          rating: 5,
          title: "Incredible fit and fabric feel!",
          comment:
            "I ordered waist size 32 with 32 inseam. The drape is top-tier and the waistband flex makes it effortlessly comfortable through an 8-hour workday.",
          isVerifiedPurchase: true,
          isApproved: true,
        },
        {
          productId: product.id,
          userId: customer.id,
          rating: 5,
          title: "Superior Indian menswear standard",
          comment:
            "Finally an Indian brand that gets trouser lengths and rise right. The finish on the pockets and seams matches European luxury brands.",
          isVerifiedPurchase: true,
          isApproved: true,
        },
      ],
    });
  }

  // 7. Seed an initial sample Order for Rahul Sharma
  const sampleProduct = await prisma.product.findFirst({
    where: { slug: "the-viceroy-italian-wool-blend-trouser" },
    include: { variants: true },
  });

  if (sampleProduct && sampleProduct.variants.length > 0) {
    const variant = sampleProduct.variants[0];
    const orderNumber = "MZ-2025-89104";

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: customer.id,
        guestEmail: customer.email,
        guestName: customer.name,
        guestPhone: customer.phone,
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentMethod: "COD",
        subtotal: 2899,
        discount: 289.9,
        shippingFee: 0,
        tax: 130.45,
        totalAmount: 2739.55,
        couponCode: "WELCOME10",
        trackingNumber: "DELHIVERY-98124901",
        estimatedDelivery: "Delivery by Thursday, 5:00 PM",
        shippingAddressJson: JSON.stringify({
          fullName: "Rahul Sharma",
          phone: "+919812345678",
          addressLine1: "Tower B, Flat 402, Green Glen Layout",
          addressLine2: "Bellandur Outer Ring Road",
          landmark: "Near EcoSpace Tech Park",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560103",
        }),
        items: {
          create: [
            {
              variantId: variant.id,
              productName: sampleProduct.name,
              colorName: variant.colorName,
              waistSize: variant.waistSize,
              inseamLength: variant.inseamLength,
              unitPrice: 2899,
              quantity: 1,
              totalPrice: 2899,
            },
          ],
        },
        payments: {
          create: [
            {
              amount: 2739.55,
              currency: "INR",
              status: "SUCCESS",
              paymentMethod: "COD",
            },
          ],
        },
      },
    });

    console.log(`Created sample order: ${order.orderNumber}`);
  }

  console.log("Database seeded successfully!");
  console.log("Admin credentials: admin@menzplaza.com / Admin@Menzplaza2025!");
  console.log("Customer credentials: rahul.sharma@example.com / Customer@123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
