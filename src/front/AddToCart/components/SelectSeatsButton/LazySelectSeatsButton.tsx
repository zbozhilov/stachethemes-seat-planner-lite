import { lazy, Suspense } from 'react';
const SelectSeatButton = lazy(() =>
  import(
    /* webpackChunkName: "front/add_to_cart/chunks/lazy.select-seat-button" */
    './SelectSeatsButton'
  )
);
const LazySelectSeatButton = (props: { fallback: React.ReactNode }) => {

  return (
    <Suspense fallback={props.fallback}>
      <SelectSeatButton />
    </Suspense>
  )
}

export default LazySelectSeatButton