import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// This is a workaround to avoid a bug in the build process.
// We should be able to use the following line instead:
// export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
export const PlaceHolderImages: ImagePlaceholder[] = (data as any).placeholderImages;
