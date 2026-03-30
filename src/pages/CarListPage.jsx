import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import CarFilter from '../components/cars/CarFilter';
import CarListRow from '../components/cars/CarListRow';
import CarSortBar from '../components/cars/CarSortBar';
import Pagination from '../components/common/Pagination';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { getCars } from '../services/api';
import { translateCar } from '../utils/translate';
import styles from './CarListPage.module.css';

const extractCars = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.data && Array.isArray(res.data.cars)) return res.data.cars;
  if (res.data && Array.isArray(res.data.data)) return res.data.data;
  if (Array.isArray(res.data)) return res.data;
  if (Array.isArray(res.cars)) return res.cars;
  return [];
};

const extractTotal = (res) => {
  if (!res) return 0;
  if (res.data && typeof res.data.total === 'number') return res.data.total;
  if (typeof res.total === 'number') return res.total;
  return extractCars(res).length;
};

export default function CarListPage() {
  const { brand, model } = useParams();
  const navigate = useNavigate();

  const [cars, setCars]       = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoad]    = useState(false);
  const [error, setError]     = useState(null);
  const [filters, setFilters] = useState({
    brand: brand || '',
    model: model || '',
    page: 1,
    limit: 20,
    sortBy: '',
  });

  useEffect(() => {
    setFilters((f) => ({ ...f, brand: brand || '', model: model || '', page: 1 }));
  }, [brand, model]);

  useEffect(() => {
    const doFetch = async () => {
      setLoad(true);
      setError(null);
      try {
        const res = await getCars(filters);
        setCars(extractCars(res).map(translateCar));
        setTotal(extractTotal(res));
      } catch (e) {
        setError(e.message);
        setCars([]);
        setTotal(0);
      } finally {
        setLoad(false);
      }
    };
    doFetch();
  }, [filters]);

  const updateFilters = (patch) => {
    setFilters((f) => ({ ...f, ...patch, page: 1 }));
    if (patch.brand !== undefined || patch.model !== undefined) {
      const b = patch.brand ?? filters.brand;
      const m = patch.model ?? filters.model;
      if (b && m) navigate(`/cars/${encodeURIComponent(b)}/${encodeURIComponent(m)}`);
      else if (b) navigate(`/cars/${encodeURIComponent(b)}`);
      else navigate('/cars');
    }
  };

  const handleSort = (sortVal) => {
    const sortMap = {
      priceAsc:    { sortBy: 'price',     sortOrder: 'asc'  },
      priceDesc:   { sortBy: 'price',     sortOrder: 'desc' },
      mileageAsc:  { sortBy: 'mileage',   sortOrder: 'asc'  },
      mileageDesc: { sortBy: 'mileage',   sortOrder: 'desc' },
      yearDesc:    { sortBy: 'year',      sortOrder: 'desc' },
      new:         { sortBy: 'createdAt', sortOrder: 'desc' },
    };
    setFilters((f) => ({ ...f, ...sortMap[sortVal], page: 1 }));
  };

  const clearFilters = () => {
    navigate('/cars');
    setFilters({ brand: '', model: '', page: 1, limit: 20, sortBy: '' });
  };

  const crumbs = [{ label: 'Нүүр хуудас', href: '/' }];
  if (filters.brand) crumbs.push({ label: filters.brand, href: `/cars/${encodeURIComponent(filters.brand)}` });
  if (filters.model) crumbs.push({ label: filters.model });

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <nav className={styles.breadcrumb}>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span className={styles.bsep}>/</span>}
              {c.href
                ? <Link to={c.href} className={styles.blink}>{c.label}</Link>
                : <span className={styles.bcur}>{c.label}</span>}
            </React.Fragment>
          ))}
          <span className={styles.btotal}>Нийт: {total.toLocaleString()} машин</span>
        </nav>

        <div className={styles.layout}>
          <CarFilter filters={filters} onChange={updateFilters} activeBrand={brand} />

          <div className={styles.main}>
            <CarSortBar
              total={total}
              activeSort={filters.sortBy}
              onSort={handleSort}
              onClearFilters={filters.brand || filters.model ? clearFilters : null}
            />

            {loading && <LoadingSpinner text="Машин хайж байна..." />}
            {error   && <ErrorMessage message={error} onRetry={() => setFilters((f) => ({ ...f }))} />}

            {!loading && !error && (
              <>
                {cars.length === 0 ? (
                  <div className={styles.empty}>
                    <p>Машин олдсонгүй. Шүүлтүүрийг өөрчлөн дахин хайна уу.</p>
                  </div>
                ) : (
                  <div className={styles.list}>
                    {cars.map((car) => (
                      <CarListRow key={car.id || car.vehicleId} car={car} />
                    ))}
                  </div>
                )}
                <Pagination
                  page={filters.page}
                  total={total}
                  limit={filters.limit}
                  onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}