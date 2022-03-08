import { PAGINATION_QUERY } from "../components/Pagination";

export function paginationField() {
  return {
    keyArgs: false, // Tells Apollo that we will take care of everything
    read(existing = [], { args, cache }) {
      console.log({ existing, args, cache });
      const { skip, first } = args;

      // Read the number of items on the page from the cache
      const paginationData = cache.readQuery({ query: PAGINATION_QUERY });

      const itemCount = paginationData?._allProductsMeta?.count;
      const page = Math.ceil(skip / first) + 1;
      const pages = Math.ceil(itemCount / first);

      // Asks the read function for those items
      const items = existing.slice(skip, skip + first).filter((x) => x);
      console.log(
        "First is",
        first,
        "\nExisting is\n",
        existing,
        "\nItems is\n",
        items
      );

      // WTF
      if (items.length && items.length !== first && page === pages) {
        return items;
      }

      if (items.length !== first) {
        // We don't have the right amount of items, we must go to the network to fetch tem
        return false;
      }

      // If there are items, just return them from the cache and we don't need to go to the network
      if (items.length) {
        console.log(`There are ${items.length} items in the cache.`);
        return items;
      }

      return false;

      // We can either do one of two things:
      // 1) Return the items because they are already in the cache
      // or
      // 2) Return false from here (network request)
    },
    merge(existing, incoming, { args }) {
      // This runs when the Apollo client comes back from the network with our items
      const { skip } = args;
      const merged = existing ? existing.concat() : [];
      for (let i = skip; i < skip + incoming.length; ++i) {
        merged[i] = incoming[i - skip];
      }
      console.log("Merged is\n", merged);
      return merged;
    },
  };
}
