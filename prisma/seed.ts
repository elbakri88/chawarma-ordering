import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { slug: 'zen-acham' },
    update: {},
    create: {
      slug: 'zen-acham',
      name: 'ZEN ACHAM',
      city: 'Casablanca',
      address: '123 Rue de la Chawarma, Casablanca',
      addressAr: '123 شارع الشاورما، الدار البيضاء',
      phone: '+212 612 345 678',
      latitude: 33.5731,
      longitude: -7.5898,
      currency: 'DH',
      instagramUrl: 'https://instagram.com/zenacham',
      logoUrl: '/assets/zen-acham-logo.svg',
      openingHours: {
        monday: { open: '09:00', close: '23:00' },
        tuesday: { open: '09:00', close: '23:00' },
        wednesday: { open: '09:00', close: '23:00' },
        thursday: { open: '09:00', close: '23:00' },
        friday: { open: '09:00', close: '23:00' },
        saturday: { open: '09:00', close: '23:00' },
        sunday: { open: '09:00', close: '23:00' },
      },
    },
  })

  // Create admin (password: admin123)
  const passwordHash = await bcrypt.hash('admin123', 10)
  await prisma.admin.upsert({
    where: { email: 'admin@zenacham.com' },
    update: {},
    create: {
      email: 'admin@zenacham.com',
      passwordHash,
      restaurantId: restaurant.id,
    },
  })

  // Categories and items
  const categories = [
    {
      nameFr: 'Entrées froides',
      nameAr: 'مقبلات باردة',
      items: [
        { nameFr: 'Mtabal d\'aubergines', nameAr: 'متبل باذنجان', price: 30 },
        { nameFr: 'Baba Ghanouj', nameAr: 'بابا غنوج', price: 30 },
        { nameFr: 'Houmous Tahina', nameAr: 'حمص بالطحين', price: 30 },
        { nameFr: 'Warak Enab', nameAr: 'ورقة العنب', price: 35 },
        { nameFr: 'Muhammara', nameAr: 'محمرة', price: 30 },
        { nameFr: 'Mtabal Betterave', nameAr: 'متبل شمندر', price: 30 },
      ],
    },
    {
      nameFr: 'Entrées Chaudes',
      nameAr: 'مقبلات ساخنة',
      items: [
        { nameFr: 'Sandwich Falafel', nameAr: 'سندويش فلافل', price: 20 },
        { nameFr: 'Falafel 5 Pièces', nameAr: 'فلافل 5 قطع', price: 20 },
        { nameFr: 'Kebah 4 Pièces', nameAr: 'كبة 4 قطع', price: 40 },
        { nameFr: 'Samoussas au fromage', nameAr: 'سمبوسة فرماج', price: 30 },
        { nameFr: 'Roulé au Fromage', nameAr: 'رولو فرماج', price: 30 },
      ],
    },
    {
      nameFr: 'Grillades',
      nameAr: 'مشاوي',
      items: [
        { nameFr: 'Plat Chiche Taouk', nameAr: 'صحن شيش طاووق', price: 65 },
        { nameFr: 'Plat Ailes De Poulet', nameAr: 'صحن جوانج دجاج', price: 60 },
        { nameFr: 'Plat Poulet Haché', nameAr: 'صحن كفتة دجاج', price: 65 },
        { nameFr: 'Plat Viande Hachée', nameAr: 'صحن كفتة لحم', price: 75 },
        { nameFr: 'Plat Brochettes Viande', nameAr: 'صحن بروشت لحم', price: 75 },
      ],
    },
    {
      nameFr: 'Sandwiches',
      nameAr: 'سندويش',
      items: [
        { nameFr: 'Sandwich Viande Hachée', nameAr: 'سندويش كفتة', price: 40 },
        { nameFr: 'Sandwich Poulet', nameAr: 'سندويش دجاج', price: 35 },
        { nameFr: 'Sandwich Shish', nameAr: 'سندويش شيش', price: 35 },
        { nameFr: 'Sandwich Chkef', nameAr: 'سندويش شقف', price: 40 },
        { nameFr: 'Sandwich Crispy', nameAr: 'سندويش كريسبي', price: 35 },
      ],
    },
    {
      nameFr: 'Salades',
      nameAr: 'سلطات',
      items: [
        { nameFr: 'Fattouch', nameAr: 'فتوش', price: 25 },
        { nameFr: 'Salade Chamia', nameAr: 'سلطة شامية', price: 20 },
        { nameFr: 'Salade Zen Acham', nameAr: 'سلطة زين الشام', price: 35 },
        { nameFr: 'Tabouleh', nameAr: 'تبولة', price: 30 },
      ],
    },
    {
      nameFr: 'Les Repas',
      nameAr: 'الوجبات',
      items: [
        { nameFr: 'Plat Chawarma Mixte', nameAr: 'طبق شاورما ميكس', price: 70 },
        { nameFr: 'Plat Chawarma Viande', nameAr: 'طبق شاورما لحم', price: 75 },
        { nameFr: 'Poulet Chawarma Plat', nameAr: 'طبق شاورما دجاج', price: 65 },
        { nameFr: 'Crispy Poulet', nameAr: 'كريسبي دجاج', price: 65 },
        { nameFr: 'Plat Chawarma avec Riz', nameAr: 'طبق شاورما مع أرز', price: 75 },
        { nameFr: 'Plat Chawarma Viande avec Riz', nameAr: 'طبق شاورما لحم مع أرز', price: 85 },
      ],
    },
    {
      nameFr: 'Al Arabi',
      nameAr: 'العربي',
      items: [
        { nameFr: 'Chawarma Arabi Viande', nameAr: 'شاورما عربي لحم', price: 60 },
        { nameFr: 'Chawarma Arabi Poulet', nameAr: 'شاورما عربي دجاج', price: 50 },
        { nameFr: 'Chawarma Arabi Mixte', nameAr: 'شاورما عربي ميكس', price: 55 },
        { nameFr: 'Chawarma Arabi Poulet Extra', nameAr: 'شاورما عربي إكستر', price: 60 },
      ],
    },
    {
      nameFr: 'Chawarma Parisien',
      nameAr: 'شاورما صمون',
      items: [
        { nameFr: 'Chawarma Viandet', nameAr: 'شاورما لحم صمون', price: 36 },
        { nameFr: 'Chawarma Poulet', nameAr: 'شاورما دجاج صمون', price: 30 },
        { nameFr: 'Chawarma Mixte', nameAr: 'شاورما ميكس صمون', price: 33 },
        { nameFr: 'Chawarma Arabi Poulet', nameAr: 'شاورما عربي صمون', price: 55 },
      ],
    },
    {
      nameFr: 'Chawarma en KG',
      nameAr: 'شاورما بالكيلوغرام',
      items: [
        { nameFr: '0.5 Kg Chawarma Poulet', nameAr: '0.5 كيلو شاورما دجاج', price: 130 },
        { nameFr: '0.5 Kg Chawarma Viande', nameAr: '0.5 كيلو شاورما لحم', price: 150 },
        { nameFr: '0.5 Kg Chawarma Mixte', nameAr: '0.5 كيلو شاورما ميكس', price: 160 },
        { nameFr: '1 Kg Chawarma Poulet', nameAr: '1 كيلو شاورما دجاج', price: 250 },
        { nameFr: '1 Kg Chawarma Viande', nameAr: '1 كيلو شاورما لحم', price: 290 },
        { nameFr: '1 Kg Chawarma Mixte', nameAr: '1 كيلو شاورما ميكس', price: 260 },
      ],
    },
    {
      nameFr: 'Cuisine Orientale',
      nameAr: 'أطباق شرقية',
      items: [
        { nameFr: 'Kabsah Poulet', nameAr: 'كبسة دجاج', price: 75 },
        { nameFr: 'Kabsah Poulet (Grand)', nameAr: 'كبسة دجاج كبير', price: 90 },
        { nameFr: 'Frikeh Poulet', nameAr: 'فريكة دجاج', price: 80 },
        { nameFr: 'Frikeh Viande', nameAr: 'فريكة لحم', price: 90 },
        { nameFr: 'Riz Kabseh', nameAr: 'أرز كبسة', price: 40 },
        { nameFr: 'Mloukhia Riz Poulet', nameAr: 'ملوخية أرز دجاج', price: 85 },
        { nameFr: 'Soupe de lentilles', nameAr: 'شوربة عدس', price: 20 },
      ],
    },
    {
      nameFr: 'Plats pour X Personnes',
      nameAr: 'أطباق عائلية',
      items: [
        { nameFr: 'Plat pour 1 Personne', nameAr: 'طبق شخص واحد', price: 75 },
        { nameFr: 'Plat pour 2 Personnes', nameAr: 'طبق شخصين', price: 90 },
        { nameFr: 'Plat pour 3 Personnes', nameAr: 'طبق ثلاث أشخاص', price: 115 },
        { nameFr: 'Plat Mixte 2 Personnes', nameAr: 'طبق مشكل لشخصين', price: 150 },
        { nameFr: 'Plat Mixte 3 Personnes', nameAr: 'طبق ثلاثة أشخاص', price: 300 },
        { nameFr: 'Plat pour 4 personnes', nameAr: 'طبق أربع أشخاص', price: 500 },
        { nameFr: 'Plat pour 6 personnes', nameAr: 'طبق ست أشخاص', price: 600 },
        { nameFr: 'Plat pour 8 personnes', nameAr: 'طبق ثمانية أشخاص', price: 750 },
      ],
    },
    {
      nameFr: 'Desserts',
      nameAr: 'الحلويات',
      items: [
        { nameFr: 'Mhalabia Avec Fruits Sec', nameAr: 'مهلبية بالمكسرات', price: 18 },
        { nameFr: 'Warbat Pistache', nameAr: 'وربات الفستق', price: 20 },
        { nameFr: 'Warbat Fruits Sec', nameAr: 'وربات بالمكسرات', price: 15 },
        { nameFr: 'Ach El Bolbol', nameAr: 'عش البلبل', price: 13 },
        { nameFr: 'Café Chamiya', nameAr: 'قهوة شامية', price: 15 },
        { nameFr: 'Cham Al Knafeh (Medium)', nameAr: 'كنافة الشام (متوسط)', price: 35 },
        { nameFr: 'Knafeh Set Al Cham (Medium)', nameAr: 'كنافة ست الشام (متوسط)', price: 45 },
        { nameFr: 'Knafeh Moulokia (Medium)', nameAr: 'كنافة ملوكية (متوسط)', price: 55 },
        { nameFr: 'Cham Al Knafeh (Large)', nameAr: 'كنافة الشام (كبير)', price: 45 },
        { nameFr: 'Knafeh Set Al Cham (Large)', nameAr: 'كنافة ست الشام (كبير)', price: 55 },
        { nameFr: 'Knafeh Moulokia (Large)', nameAr: 'كنافة ملوكية (كبير)', price: 65 },
      ],
    },
    {
      nameFr: 'Les Jus',
      nameAr: 'العصائر',
      items: [
        { nameFr: 'Jus de Pomme', nameAr: 'عصير تفاح', price: 18 },
        { nameFr: 'Banane de Jus', nameAr: 'عصير موز', price: 18 },
        { nameFr: 'Jus d\'Orange', nameAr: 'عصير برتقال', price: 15 },
        { nameFr: 'Jus de mango', nameAr: 'عصير مانجو', price: 20 },
        { nameFr: 'Jus d\'avocat', nameAr: 'عصير أفوكادو', price: 22 },
        { nameFr: 'Jus de Fraise', nameAr: 'عصير فراولة', price: 20 },
        { nameFr: 'Jus de Citron', nameAr: 'عصير ليمون', price: 18 },
        { nameFr: 'Jus de Citron à la Menthe', nameAr: 'عصير ليمون بالنعناع', price: 20 },
        { nameFr: 'Jus de Citron au Gingembre', nameAr: 'عصير ليمون بالزنجبيل', price: 20 },
        { nameFr: 'Jus d\'Anans', nameAr: 'عصير أناناس', price: 20 },
        { nameFr: 'Panaché au lait', nameAr: 'باناشي بالحليب', price: 20 },
        { nameFr: 'Panaché au Jus d\'orange', nameAr: 'باناشي بعصير البرتقال', price: 20 },
        { nameFr: 'Laban Ayran', nameAr: 'لبن عيران', price: 18 },
        { nameFr: 'Karkadia', nameAr: 'كركديه', price: 18 },
        { nameFr: 'Jus de Carotte', nameAr: 'عصير جزر', price: 20 },
      ],
    },
  ]

  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i]
    const category = await prisma.category.create({
      data: {
        restaurantId: restaurant.id,
        nameFr: cat.nameFr,
        nameAr: cat.nameAr,
        displayOrder: i,
        isActive: true,
      },
    })

    for (let j = 0; j < cat.items.length; j++) {
      const item = cat.items[j]
      await prisma.item.create({
        data: {
          categoryId: category.id,
          nameFr: item.nameFr,
          nameAr: item.nameAr,
          price: item.price,
          isAvailable: true,
          displayOrder: j,
        },
      })
    }
  }

  console.log('✅ Seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

