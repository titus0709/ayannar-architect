import ConcentricRingsLoader from "@/components/ui/loader"

export default function Loading() {
  return (
    <main
      className="
        fixed inset-0 z-50
        flex min-h-screen
        items-center justify-center
        overflow-hidden
        bg-background
        px-4
      "
    >
      <div
        className="
          flex w-full
          max-w-[95vw]
          items-center justify-center

          *:max-w-full
        "
      >
        <ConcentricRingsLoader
          size={140}
          color="#D4AF37"
          text="Welcome to Ayyanar Architects website"
          subText="Loading..."
          showText={true}
          rings={4}
        />
      </div>
    </main>
  )
}