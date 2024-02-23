# image2epub
> A cli that converts image files to EPUB format. Supports batch conversion. Implemented based on `epub-gen`

## Use
```shell
# It performs a deep search of the specified directory and converts images into an EPUB file.
# One sub folder corresponds to one EPUB file.
npx image2epub g /target -d -t test -o ./

# convert a dir
npx image2epub g /target -t test/a1 -o ./

# set author
npx image2epub g /target -a my-name -o ./

# set title
npx image2epub g /target -t test2 -o ./

# other options
npx image2epub g -h
npx image2epub -h
```
