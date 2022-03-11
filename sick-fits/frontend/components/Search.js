import { useLazyQuery } from "@apollo/client";
import { resetIdCounter, useCombobox } from "downshift";
import gql from "graphql-tag";
import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { DropDown, DropDownItem, SearchStyles } from "./styles/DropDown";

const SEARCH_PRODUCTS_QUERY = gql`
  query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
    allProducts(
      where: {
        OR: [
          { name_contains_i: $searchTerm }
          { description_contains_i: $searchTerm }
        ]
      }
    ) {
      id
      name
      photo {
        src
        altText
      }
    }
  }
`;

export function Search() {
  const router = useRouter();
  const [findItems, { loading, data }] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
    fetchPolicy: "no-cache",
  });
  const items = data?.allProducts || [];

  // While debouncing sounds like a cool concept, there seems to be something wrong with this
  // setup, as the resulting effect of this current component is that the results shown for
  // the n+1th keypress into the search box is from a search executed using the input from
  // the nth keypress.
  const findItemsButChill = useMemo(
    () => debounce(findItems, 350),
    [findItems]
  );
  resetIdCounter();
  const {
    highlightedIndex,
    inputValue,
    isOpen,
    getComboboxProps,
    getMenuProps,
    getInputProps,
    getItemProps,
  } = useCombobox({
    items,
    itemToString(item) {
      item?.name || "";
    },
    onInputValueChange() {
      findItemsButChill({ variables: { searchTerm: inputValue } });
    },
    onSelectedItemChange({ selectedItem }) {
      router.push({
        pathname: "/product/[id]",
        query: { id: selectedItem.id },
      });
    },
  });

  return (
    <SearchStyles>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps({
            className: loading ? "loading" : "",
            id: "search",
            placeholder: "Search for an Item",
            type: "search",
          })}
        />
      </div>
      <DropDown {...getMenuProps()}>
        {isOpen &&
          items.map((item, index) => (
            <DropDownItem
              {...getItemProps({ item, index })}
              key={item.id}
              highlighted={index === highlightedIndex}
            >
              <img
                src={item.photo.src}
                alt={item.photo.altText || item.name}
                width={50}
              />
              {item.name}
            </DropDownItem>
          ))}
        {isOpen && items.length === 0 && !loading && (
          <DropDownItem>No search results for "{inputValue}"</DropDownItem>
        )}
      </DropDown>
    </SearchStyles>
  );
}
