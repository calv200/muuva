export default function RoutineVideo({ routine }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="aspect-video overflow-hidden bg-ink">
        <iframe
          className="h-full w-full"
          src={routine.youtubeEmbedUrl}
          title={`${routine.title} video`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
