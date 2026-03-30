// apicars.info-ийн утгууд англиар ирдэг
// "Hybrid (Gasoline)", "Automatic", "Diesel" гэх мэт

const FUEL_MAP = {
  'gasoline':              'Бензин',
  'petrol':                'Бензин',
  'diesel':                'Дизель',
  'electric':              'Цахилгаан',
  'hybrid':                'Hybrid',
  'hybrid (gasoline)':     'Hybrid (Бензин)',
  'hybrid (petrol)':       'Hybrid (Бензин)',
  'hybrid (diesel)':       'Hybrid (Дизель)',
  'gasoline+electric':     'Бензин+Цахилгаан',
  'petrol+electric':       'Бензин+Цахилгаан',
  'diesel+electric':       'Дизель+Цахилгаан',
  'plug-in hybrid':        'Залгадаг гибрид',
  'lpg':                   'Газ (LPG)',
  'cng':                   'Газ (CNG)',
  'hydrogen':              'Устөрөгч',
  // Солонгос
  '가솔린':                'Бензин',
  '디젤':                  'Дизель',
  '전기':                  'Цахилгаан',
  '하이브리드':            'Hybrid',
  '가솔린+전기':           'Бензин+Цахилгаан',
};

const TRANS_MAP = {
  'automatic':   'Автомат',
  'auto':        'Автомат',
  'manual':      'Механик',
  'cvt':         'CVT',
  'dct':         'DCT',
  'amt':         'AMT',
  'semi-auto':   'Хагас автомат',
  // Солонгос
  '오토':        'Автомат',
  '자동':        'Автомат',
  '수동':        'Механик',
};

const COLOR_MAP = {
  'white':       'Цагаан',
  'black':       'Хар',
  'silver':      'Мөнгөлөг',
  'gray':        'Саарал',
  'grey':        'Саарал',
  'red':         'Улаан',
  'blue':        'Цэнхэр',
  'navy':        'Хар цэнхэр',
  'green':       'Ногоон',
  'yellow':      'Шар',
  'orange':      'Улбар шар',
  'brown':       'Хүрэн',
  'beige':       'Бежевый',
  'gold':        'Алтан',
  'purple':      'Нил ягаан',
  'pink':        'Ягаан',
  'pearl':       'Сувдан',
  // Солонгос
  '흰색': 'Цагаан', '검정': 'Хар', '은색': 'Мөнгөлөг',
  '회색': 'Саарал', '쥐색': 'Саарал', '빨강': 'Улаан',
  '파랑': 'Цэнхэр', '초록': 'Ногоон', '노랑': 'Шар',
};

const tr = (map, val) => {
  if (!val) return val;
  const key = String(val).trim().toLowerCase();
  return map[key] || val;
};

export const translateFuel         = (v) => tr(FUEL_MAP,  v);
export const translateTransmission = (v) => tr(TRANS_MAP, v);
export const translateColor        = (v) => tr(COLOR_MAP, v);

/**
 * apicars.info машины объектыг Монгол утгуудтай болгох
 * price: "3090.00" KRW → prices.KRW = 30900000 ашиглах
 */
export const translateCar = (car) => {
  if (!car) return car;

  // Үнэ: prices.KRW > price*10000 > price
  const krwPrice =
    car.prices?.KRW ||
    (car.price ? Math.round(parseFloat(car.price) * 10000) : null);

  return {
    ...car,
    // Үнэ
    krwPrice,
    basePrice: krwPrice,
    // Зураг
    thumbnail: car.image || (Array.isArray(car.images) ? car.images[0] : null),
    // Орчуулсан талбарууд
    fuelType:     translateFuel(car.fuelType || car.fuel),
    fuel:         translateFuel(car.fuelType || car.fuel),
    transmission: translateTransmission(car.transmission),
    color:        translateColor(car.color),
    // Жил нэрлэлт нэгдсэн болгох
    manufactureYear: car.year || car.manufactureYear,
  };
};