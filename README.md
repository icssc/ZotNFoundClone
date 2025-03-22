# ZotNFound Concept Clone in NextJS

## TODO

- [x] Figure out how to make it so that React Scan runs instantly
- [x] Figure out how to make it so that the zoom is zoomed in only to UCI
- [ ] Add skeletons for everything, streaming in data as it comes in
  - [x] Map Skeleton
  - [ ] Card/ List Skeleton
  - [ ] Profile Skeleton
- [ ] Make a handle Scroll which does loading more data cleanly for infinite scroll without shifting and making it smooth and not jumpy
- [ ] Make a search bar on the bottom along with filters on the bottom as well
- [ ] Think and make a react state model so that state is shared nicely between components using React Context
- [ ] Try to remove "use client" from as many components as possible since we want to take advantage of SSR as much as possible for SEO
- [ ] Finishing about page
- [ ] Finishing contact page
- [x] Adding markers and clustering
- [ ] Making it so that it prompts user that chrome will have the best experience
- [ ] Making it so that it prompts user that they can add it to their home screen
- [ ] Using ppr correctly, and potentially an edge network or something considering everyone is near UCI making the loading faster
- [x] Changing the dialog to a shared dialog with data passed in changing the content

## Potential Future Overkill Features & Optimizations

- [ ] Maybe in the future adding convex for an even better sync layer along with tanstack query (already using tanstack/react-query)
