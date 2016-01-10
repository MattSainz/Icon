Simple application for viewing a collection of networks

##TODO

###0. look into making it possible / easy for user to change the sorting of the groupIDs (e.g., sort alphabetical by groupID, by subdomain, or by domain).

###1. minipage format changes
  - make little carrot button (top right corner) into a FAB
  - change max edges -> Avg Edges
  - change max nodes -> Avg Nodes
  - "Source and Citation" to "Citation"
  - "Source" (URL) -> move that to end of the line of the citation text and call it "Link".
  - "Node and Edge Info" --> "Network Summary"
  - "Individual Graphs and Info" -> "Network Data Sets"
  - create new tiny-text+red-line+text-box object below "Citation" and above "Network Data Sets": tiny text is "Data hosted by" and the text box should be 1 line of text at most (e.g., "Data hosted by Laboratory for Web Algorithmics" followed by a "Link" with a URL underneath.
  - change "Download" (URL) --> "Link"
  - change "Download" text header --> "Source"
  - add in the file size conversion stuff
  - make a new column for each network called "Format".

if "File Type" is 'gml', then make "Format" = 'gml' and "File Type" = 'txt'
if "File Type" is 'graphML', then make "Format" = 'graphML' and "File Type" = 'txt'
if "File Type" is 'edgelist', then make "Format" = 'edgelist' and "File Type" = 'txt'
if "File Type" is 'xml', then make "Format" = 'edgelist'
if "File Type" is 'zip', then make "Format" = 'unknown'
  
###2. filter format changes
  - add tiny text "Filter by" above the current four tabs
  - add a circular progress bar over the filter text to say that the page is loading (maybe add text of "Loading..." underneath? you choose)
  - add tiny text "Search by (accepts simple logical queries)" above the search box, with a little eye / link to a page that explains the type of logical queries it takes
  - Change the grey default search text of "Search" to "(This) OR (That)"
  - add "Clear filters" button somewhere (just clears filters as if the page were reloaded)
         
###3. talk about what database statistics and vizs would be good
  - put "Domains", "Graph Properties", "Node and Edge Distributions" dynamic figures on the main landing page
  - change "Networks 188" to "Networks found: 188"
          
###4. edit interface change
  - move big plus button (at the very bottom) to the top of the page
  - make "Remove" column header text = white
          
###5. look at how hard it is to set up a wiki (for the link rot page first, and for the extended description pages second).
  - if you have time, start working on the link rot chron job (using a hash of the linked page to detect whether it has changed relative to the last time the chron job ran; and if so, post it to the link rot page for a human to verify)
          
###6. documentation for Aaron (how to do things once you're gone))
