# ZotNFound Concept Clone in NextJS

## TODO

- [ ] Add skeletons for everything, streaming in data as it comes in
  - [x] Map Skeleton
  - [ ] Card/ List Skeleton
  - [ ] Profile Skeleton
- [ ] Make a handle Scroll which does loading more data cleanly for infinite scroll without shifting and making it smooth and not jumpy
- [ ] Make a search bar on the bottom along with filters on the bottom as well
- [ ] Try to remove "use client" from as many components as possible since we want to take advantage of SSR as much as possible for SEO
  - [ ] Get Server Side Props for data fetching
  - [ ] Re-considering this for optimistic updates though since, if we want to make changes to the UI and the app, server side props are static by nature and don't allow for dynamic updates since that would require polling {to be fore we can do this with react-query}
- [ ] Finishing about page
- [ ] Finishing contact page
- [x] Adding markers and clustering
- [ ] Making it so that it prompts user that chrome will have the best experience (since the rasterization is better in chrome)
- [ ] Making it so that it prompts user that they can add it to their home screen
- [x] Changing the dialog to a shared dialog with data passed in changing the content

## Potential Future Overkill Features & Optimizations

- [ ] Maybe in the future adding convex for an even better sync layer along with tanstack query (already using tanstack/react-query)

[Interleaving Causing second request](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#interleaving-server-and-client-components)
[Why Context Providers work?](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#interleaving-server-and-client-components)
[use Hook React](https://nextjs.org/docs/app/guides/single-page-applications#using-reacts-use-within-a-context-provider)

We might not need react-query since we only want revalidation of state really, no caching needed I don't think but a decision to be made later of only using [swr](https://nextjs.org/docs/app/guides/single-page-applications#spas-with-swr)
