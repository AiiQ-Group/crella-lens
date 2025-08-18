interface ImagePreviewProps {
  imageUrl: string
  alt?: string
}

export default function ImagePreview({ imageUrl, alt = "Uploaded image" }: ImagePreviewProps) {
  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-auto max-h-96 object-contain"
      />
      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
        Preview
      </div>
    </div>
  )
}
