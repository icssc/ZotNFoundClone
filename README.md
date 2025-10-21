# ZotNFound Concept Clone in NextJS

## TODO

- [ ] Add skeletons for everything, streaming in data as it comes in
  - [x] Map Skeleton
  - [x] Card/ List Skeleton (not needed prefetched)
  - [ ] Profile Skeleton
- [ ] Make a search bar on the bottom along with filters on the bottom as well
- [ ] Making a post does ISR, so that everything else can remain static.
- [-] Finishing about page
- [ ] Finishing contact page
- [x] Adding markers and clustering
- [ ] Making it so that it prompts user that chrome will have the best experience (since the rasterization is better in chrome)
- [ ] Making it so that it prompts user that they can add it to their home screen
- [x] Changing the dialog to a shared dialog with data passed in changing the content
- [ ] [Profile picture caching](https://github.com/icssc/ZotNFoundClone/pull/42#issuecomment-3424244820)

[Interleaving Causing second request](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#interleaving-server-and-client-components)

- [x] Make a handle Scroll which does loading more data cleanly for infinite scroll without shifting and making it smooth and not jumpy
      => this would be impossible since the markers would also have to be changing, and you can't progressively gtet more items, simply becayuse markers
