{/* Added to taste the filters */}


const mockProducts = [
  {
    "id": "p001",
    "name": "Brown Knitwear",
    "brand": "UAE",
    "price": 1537,
    "color": "Brown",
    "sizes": [
      "XXL",
      "XL",
      "L"
    ],
    "fabric": "Denim",
    "rating": 4.4,
    "category": "women",
    "subcategory": "knitwear"
  },
  {
    "id": "p002",
    "name": "Brown Jeans",
    "brand": "Classic",
    "price": 1235,
    "color": "White",
    "sizes": [
      "M",
      "S",
      "XXL",
      "XS"
    ],
    "fabric": "Silk",
    "rating": 4.6,
    "category": "men",
    "subcategory": "jeans"
  },
  {
    "id": "p003",
    "name": "Blue Trousers",
    "brand": "Classic",
    "price": 981,
    "color": "Gray",
    "sizes": [
      "XXL",
      "XL",
      "S"
    ],
    "fabric": "Leather",
    "rating": 4.1,
    "category": "men",
    "subcategory": "trousers"
  },
  {
    "id": "p004",
    "name": "Gray Jeans",
    "brand": "Classic",
    "price": 1170,
    "color": "Beige",
    "sizes": [
      "M",
      "XL",
      "L",
      "XS",
      "XXL"
    ],
    "fabric": "Fleece",
    "rating": 4.5,
    "category": "men",
    "subcategory": "jeans"
  },
  {
    "id": "p005",
    "name": "Blue Tops",
    "brand": "UAE",
    "price": 905,
    "color": "Navy",
    "sizes": [
      "M",
      "XL",
      "XXL",
      "XS",
      "S"
    ],
    "fabric": "Silk",
    "rating": 4.1,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p006",
    "name": "Brown Jackets",
    "brand": "UAE",
    "price": 1044,
    "color": "White",
    "sizes": [
      "XXL",
      "S",
      "XL",
      "M"
    ],
    "fabric": "Linen",
    "rating": 4.6,
    "category": "women",
    "subcategory": "jackets"
  },
  {
    "id": "p007",
    "name": "Gray Knitwear",
    "brand": "Elite",
    "price": 1333,
    "color": "Gray",
    "sizes": [
      "XS",
      "M"
    ],
    "fabric": "Fleece",
    "rating": 3.8,
    "category": "men",
    "subcategory": "knitwear"
  },
  {
    "id": "p008",
    "name": "Beige Tops",
    "brand": "Designer",
    "price": 1222,
    "color": "Black",
    "sizes": [
      "S",
      "XL",
      "XXL",
      "XS"
    ],
    "fabric": "Polyester",
    "rating": 3.9,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p009",
    "name": "Black Trousers",
    "brand": "Classic",
    "price": 427,
    "color": "Blue",
    "sizes": [
      "XXL",
      "M",
      "XL",
      "L",
      "XS"
    ],
    "fabric": "Cotton",
    "rating": 4.4,
    "category": "men",
    "subcategory": "trousers"
  },
  {
    "id": "p010",
    "name": "Navy Knitwear",
    "brand": "Classic",
    "price": 969,
    "color": "Gray",
    "sizes": [
      "XL",
      "L",
      "XS"
    ],
    "fabric": "Cotton",
    "rating": 4.8,
    "category": "women",
    "subcategory": "knitwear"
  },
  {
    "id": "p011",
    "name": "White Shirts",
    "brand": "Designer",
    "price": 260,
    "color": "Blue",
    "sizes": [
      "M",
      "S"
    ],
    "fabric": "Fleece",
    "rating": 4.9,
    "category": "men",
    "subcategory": "shirts"
  },
  {
    "id": "p012",
    "name": "Red Pants",
    "brand": "Premium",
    "price": 966,
    "color": "Beige",
    "sizes": [
      "XS",
      "L"
    ],
    "fabric": "Polyester",
    "rating": 4.0,
    "category": "women",
    "subcategory": "pants"
  },
  {
    "id": "p013",
    "name": "Beige Suits",
    "brand": "Elite",
    "price": 332,
    "color": "White",
    "sizes": [
      "XL",
      "L",
      "S",
      "XS",
      "XXL"
    ],
    "fabric": "Cotton",
    "rating": 4.0,
    "category": "men",
    "subcategory": "suits"
  },
  {
    "id": "p014",
    "name": "Beige Jeans",
    "brand": "Premium",
    "price": 573,
    "color": "Brown",
    "sizes": [
      "L",
      "XXL"
    ],
    "fabric": "Cotton",
    "rating": 4.7,
    "category": "women",
    "subcategory": "jeans"
  },
  {
    "id": "p015",
    "name": "Red Shirts",
    "brand": "Elite",
    "price": 650,
    "color": "White",
    "sizes": [
      "XL",
      "S",
      "M",
      "L"
    ],
    "fabric": "Fleece",
    "rating": 4.4,
    "category": "men",
    "subcategory": "shirts"
  },
  {
    "id": "p016",
    "name": "Beige Suits",
    "brand": "Premium",
    "price": 1409,
    "color": "Black",
    "sizes": [
      "M",
      "L"
    ],
    "fabric": "Denim",
    "rating": 4.4,
    "category": "men",
    "subcategory": "suits"
  },
  {
    "id": "p017",
    "name": "Brown Tops",
    "brand": "Premium",
    "price": 1354,
    "color": "White",
    "sizes": [
      "XL",
      "XS"
    ],
    "fabric": "Linen",
    "rating": 4.3,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p018",
    "name": "White Knitwear",
    "brand": "UAE",
    "price": 968,
    "color": "Navy",
    "sizes": [
      "XXL",
      "S",
      "L",
      "XS"
    ],
    "fabric": "Leather",
    "rating": 4.9,
    "category": "men",
    "subcategory": "knitwear"
  },
  {
    "id": "p019",
    "name": "Blue Jeans",
    "brand": "Premium",
    "price": 750,
    "color": "White",
    "sizes": [
      "XXL",
      "XL"
    ],
    "fabric": "Fleece",
    "rating": 4.5,
    "category": "women",
    "subcategory": "jeans"
  },
  {
    "id": "p020",
    "name": "Blue Skirts",
    "brand": "Classic",
    "price": 1492,
    "color": "Red",
    "sizes": [
      "XXL",
      "M",
      "S",
      "L"
    ],
    "fabric": "Leather",
    "rating": 4.2,
    "category": "women",
    "subcategory": "skirts"
  },
  {
    "id": "p021",
    "name": "Blue Activewear",
    "brand": "Classic",
    "price": 251,
    "color": "Blue",
    "sizes": [
      "XXL",
      "XS"
    ],
    "fabric": "Polyester",
    "rating": 4.3,
    "category": "men",
    "subcategory": "activewear"
  },
  {
    "id": "p022",
    "name": "Black T-shirts",
    "brand": "UAE",
    "price": 690,
    "color": "Blue",
    "sizes": [
      "XL",
      "S"
    ],
    "fabric": "Leather",
    "rating": 4.6,
    "category": "men",
    "subcategory": "t-shirts"
  },
  {
    "id": "p023",
    "name": "Red Jeans",
    "brand": "UAE",
    "price": 1079,
    "color": "Brown",
    "sizes": [
      "XXL",
      "L",
      "S",
      "XS"
    ],
    "fabric": "Leather",
    "rating": 4.3,
    "category": "men",
    "subcategory": "jeans"
  },
  {
    "id": "p024",
    "name": "Beige Tops",
    "brand": "UAE",
    "price": 1234,
    "color": "Beige",
    "sizes": [
      "XL",
      "L",
      "M"
    ],
    "fabric": "Linen",
    "rating": 4.4,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p025",
    "name": "White Knitwear",
    "brand": "UAE",
    "price": 990,
    "color": "Red",
    "sizes": [
      "XXL",
      "S"
    ],
    "fabric": "Denim",
    "rating": 4.0,
    "category": "women",
    "subcategory": "knitwear"
  },
  {
    "id": "p026",
    "name": "Gray Dresses",
    "brand": "UAE",
    "price": 570,
    "color": "Blue",
    "sizes": [
      "XL",
      "M",
      "XS"
    ],
    "fabric": "Leather",
    "rating": 4.8,
    "category": "women",
    "subcategory": "dresses"
  },
  {
    "id": "p027",
    "name": "Red Jeans",
    "brand": "Premium",
    "price": 1268,
    "color": "Navy",
    "sizes": [
      "M",
      "XS",
      "L"
    ],
    "fabric": "Fleece",
    "rating": 4.6,
    "category": "men",
    "subcategory": "jeans"
  },
  {
    "id": "p028",
    "name": "Navy Jeans",
    "brand": "Premium",
    "price": 401,
    "color": "Navy",
    "sizes": [
      "XL",
      "XXL"
    ],
    "fabric": "Leather",
    "rating": 4.8,
    "category": "men",
    "subcategory": "jeans"
  },
  {
    "id": "p029",
    "name": "Gray Tops",
    "brand": "Elite",
    "price": 1511,
    "color": "Beige",
    "sizes": [
      "S",
      "XL",
      "XXL",
      "M"
    ],
    "fabric": "Linen",
    "rating": 4.6,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p030",
    "name": "Gray Knitwear",
    "brand": "Designer",
    "price": 166,
    "color": "Gray",
    "sizes": [
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "fabric": "Denim",
    "rating": 4.6,
    "category": "men",
    "subcategory": "knitwear"
  },
  {
    "id": "p031",
    "name": "Red Dresses",
    "brand": "Designer",
    "price": 727,
    "color": "Navy",
    "sizes": [
      "M",
      "S",
      "L"
    ],
    "fabric": "Leather",
    "rating": 4.4,
    "category": "women",
    "subcategory": "dresses"
  },
  {
    "id": "p032",
    "name": "Navy Tops",
    "brand": "Premium",
    "price": 1183,
    "color": "Blue",
    "sizes": [
      "XXL",
      "XL",
      "M",
      "S",
      "XS"
    ],
    "fabric": "Leather",
    "rating": 4.1,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p033",
    "name": "Blue Activewear",
    "brand": "Elite",
    "price": 1051,
    "color": "Black",
    "sizes": [
      "XS",
      "XXL"
    ],
    "fabric": "Polyester",
    "rating": 4.1,
    "category": "men",
    "subcategory": "activewear"
  },
  {
    "id": "p034",
    "name": "Black Pants",
    "brand": "Premium",
    "price": 1370,
    "color": "Gray",
    "sizes": [
      "XL",
      "L"
    ],
    "fabric": "Leather",
    "rating": 4.4,
    "category": "women",
    "subcategory": "pants"
  },
  {
    "id": "p035",
    "name": "Gray Pants",
    "brand": "UAE",
    "price": 346,
    "color": "Black",
    "sizes": [
      "M",
      "XL",
      "S"
    ],
    "fabric": "Cotton",
    "rating": 3.8,
    "category": "women",
    "subcategory": "pants"
  },
  {
    "id": "p036",
    "name": "Blue Tops",
    "brand": "Classic",
    "price": 614,
    "color": "Brown",
    "sizes": [
      "XS",
      "XL",
      "M",
      "L",
      "XXL"
    ],
    "fabric": "Silk",
    "rating": 3.9,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p037",
    "name": "Beige Activewear",
    "brand": "Classic",
    "price": 1059,
    "color": "Gray",
    "sizes": [
      "XXL",
      "XL",
      "M"
    ],
    "fabric": "Polyester",
    "rating": 3.8,
    "category": "women",
    "subcategory": "activewear"
  },
  {
    "id": "p038",
    "name": "Navy Dresses",
    "brand": "UAE",
    "price": 1417,
    "color": "Red",
    "sizes": [
      "XS",
      "XXL",
      "S"
    ],
    "fabric": "Leather",
    "rating": 4.6,
    "category": "women",
    "subcategory": "dresses"
  },
  {
    "id": "p039",
    "name": "Navy Activewear",
    "brand": "Elite",
    "price": 836,
    "color": "Brown",
    "sizes": [
      "XXL",
      "L",
      "XS"
    ],
    "fabric": "Wool",
    "rating": 4.3,
    "category": "men",
    "subcategory": "activewear"
  },
  {
    "id": "p040",
    "name": "Brown Shirts",
    "brand": "Classic",
    "price": 1096,
    "color": "Blue",
    "sizes": [
      "XXL",
      "M",
      "S"
    ],
    "fabric": "Silk",
    "rating": 4.4,
    "category": "men",
    "subcategory": "shirts"
  },
  {
    "id": "p041",
    "name": "Brown Tops",
    "brand": "Elite",
    "price": 1025,
    "color": "White",
    "sizes": [
      "L",
      "XS"
    ],
    "fabric": "Leather",
    "rating": 4.9,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p042",
    "name": "Navy Activewear",
    "brand": "Designer",
    "price": 593,
    "color": "Beige",
    "sizes": [
      "XXL",
      "XS"
    ],
    "fabric": "Leather",
    "rating": 3.9,
    "category": "women",
    "subcategory": "activewear"
  },
  {
    "id": "p043",
    "name": "White Suits",
    "brand": "Classic",
    "price": 546,
    "color": "White",
    "sizes": [
      "XS",
      "M"
    ],
    "fabric": "Denim",
    "rating": 4.7,
    "category": "men",
    "subcategory": "suits"
  },
  {
    "id": "p044",
    "name": "Red Knitwear",
    "brand": "Designer",
    "price": 562,
    "color": "Red",
    "sizes": [
      "XS",
      "M",
      "L",
      "XXL",
      "XL"
    ],
    "fabric": "Linen",
    "rating": 4.4,
    "category": "women",
    "subcategory": "knitwear"
  },
  {
    "id": "p045",
    "name": "Navy Jeans",
    "brand": "UAE",
    "price": 1415,
    "color": "Beige",
    "sizes": [
      "M",
      "XS",
      "L",
      "XL",
      "S"
    ],
    "fabric": "Polyester",
    "rating": 4.6,
    "category": "women",
    "subcategory": "jeans"
  },
  {
    "id": "p046",
    "name": "Gray Activewear",
    "brand": "UAE",
    "price": 427,
    "color": "Blue",
    "sizes": [
      "XXL",
      "M",
      "XS",
      "S",
      "XL"
    ],
    "fabric": "Polyester",
    "rating": 4.4,
    "category": "men",
    "subcategory": "activewear"
  },
  {
    "id": "p047",
    "name": "Beige Jackets",
    "brand": "Elite",
    "price": 191,
    "color": "Beige",
    "sizes": [
      "XXL",
      "XL",
      "XS"
    ],
    "fabric": "Cotton",
    "rating": 3.9,
    "category": "men",
    "subcategory": "jackets"
  },
  {
    "id": "p048",
    "name": "White Jeans",
    "brand": "Elite",
    "price": 1256,
    "color": "Black",
    "sizes": [
      "S",
      "XS",
      "M",
      "L"
    ],
    "fabric": "Silk",
    "rating": 4.4,
    "category": "men",
    "subcategory": "jeans"
  },
  {
    "id": "p049",
    "name": "Beige Activewear",
    "brand": "Designer",
    "price": 333,
    "color": "White",
    "sizes": [
      "XS",
      "XXL",
      "M"
    ],
    "fabric": "Cotton",
    "rating": 4.7,
    "category": "women",
    "subcategory": "activewear"
  },
  {
    "id": "p050",
    "name": "Black Jackets",
    "brand": "Designer",
    "price": 798,
    "color": "Navy",
    "sizes": [
      "M",
      "XXL",
      "XL"
    ],
    "fabric": "Leather",
    "rating": 3.9,
    "category": "men",
    "subcategory": "jackets"
  },
  {
    "id": "p051",
    "name": "Beige T-shirts",
    "brand": "Classic",
    "price": 890,
    "color": "Navy",
    "sizes": [
      "S",
      "XS",
      "L"
    ],
    "fabric": "Linen",
    "rating": 4.6,
    "category": "men",
    "subcategory": "t-shirts"
  },
  {
    "id": "p052",
    "name": "Blue Tops",
    "brand": "Classic",
    "price": 473,
    "color": "Gray",
    "sizes": [
      "M",
      "XS"
    ],
    "fabric": "Silk",
    "rating": 4.7,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p053",
    "name": "Navy Knitwear",
    "brand": "Elite",
    "price": 208,
    "color": "Black",
    "sizes": [
      "S",
      "XS"
    ],
    "fabric": "Leather",
    "rating": 3.9,
    "category": "women",
    "subcategory": "knitwear"
  },
  {
    "id": "p054",
    "name": "Brown Suits",
    "brand": "Classic",
    "price": 354,
    "color": "Blue",
    "sizes": [
      "S",
      "M"
    ],
    "fabric": "Denim",
    "rating": 4.8,
    "category": "men",
    "subcategory": "suits"
  },
  {
    "id": "p055",
    "name": "Brown Skirts",
    "brand": "Premium",
    "price": 1432,
    "color": "Gray",
    "sizes": [
      "XL",
      "XXL"
    ],
    "fabric": "Cotton",
    "rating": 4.3,
    "category": "women",
    "subcategory": "skirts"
  },
  {
    "id": "p056",
    "name": "Gray Activewear",
    "brand": "Premium",
    "price": 702,
    "color": "Blue",
    "sizes": [
      "L",
      "S",
      "XL",
      "XS"
    ],
    "fabric": "Silk",
    "rating": 4.9,
    "category": "women",
    "subcategory": "activewear"
  },
  {
    "id": "p057",
    "name": "Blue Tops",
    "brand": "Premium",
    "price": 276,
    "color": "White",
    "sizes": [
      "XS",
      "L",
      "XL",
      "S",
      "XXL"
    ],
    "fabric": "Leather",
    "rating": 4.8,
    "category": "women",
    "subcategory": "tops"
  },
  {
    "id": "p058",
    "name": "Brown Activewear",
    "brand": "Designer",
    "price": 1599,
    "color": "White",
    "sizes": [
      "XXL",
      "XL",
      "S",
      "L",
      "XS"
    ],
    "fabric": "Denim",
    "rating": 3.9,
    "category": "women",
    "subcategory": "activewear"
  },
  {
    "id": "p059",
    "name": "Gray Activewear",
    "brand": "Classic",
    "price": 220,
    "color": "Brown",
    "sizes": [
      "XL",
      "L",
      "M",
      "XXL",
      "XS"
    ],
    "fabric": "Linen",
    "rating": 4.7,
    "category": "men",
    "subcategory": "activewear"
  },
  {
    "id": "p060",
    "name": "White Tops",
    "brand": "Elite",
    "price": 815,
    "color": "Gray",
    "sizes": [
      "M",
      "L",
      "S",
      "XXL",
      "XS"
    ],
    "fabric": "Silk",
    "rating": 4.0,
    "category": "women",
    "subcategory": "tops"
  }
];

export default mockProducts;