'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function Search({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // -------------------------------------
  // function handleSearch(term: string) {
  //   console.log(`Searching... ${term}`);

  //   const params = new URLSearchParams(searchParams);
  //   if (term) {
  //     params.set('query', term);
  //   } else {
  //     params.delete('query');
  //   }

  //   replace(`${pathname}?${params.toString()}`)
  // }

  // the above version of handleSearch would cause a database query on every keystroke
  // this causes an issue when applications scale
  // to solve this issue, we can use 'debouncing', which will limit the number of queries made
  // based on a defined wait time.
  // to do so, we import useDebouncedCallback, then wrap the body of the above function as a callback in it as an argument. we also provide a ms value as a second argument
  // vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv

  const handleSearch = useDebouncedCallback((term) => {
    console.log(`Searching... ${term}`);

    const params = new URLSearchParams(searchParams);
    
    // reset page number to 1 when user types a new search query
    params.set('page', '1');

    // if the user has entered text, set it as the value of the query, else delete it
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }

    replace(`${pathname}?${params.toString()}`)
    // ${pathname} is the current path
    // As the user types intot he search bar, params.toString() translates this input into a URL-friendly format
    // the replace call updates the URL with the user's search data
    // the URL is updated without reloading to the page (Next.js client side navigation)
  }, 300);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handleSearch(e.target.value)}

        // to ensure the input field is in sync with the URL and will be populated when sharing, we add a defaultValue attribute to the input element by reading from searchParams
        defaultValue={searchParams.get('query')?.toString()}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
