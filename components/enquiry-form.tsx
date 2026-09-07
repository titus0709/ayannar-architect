"use client"

const projectTypes = [
  "Temple Commission",
  "Restoration",
  "Consultation",
  "Other",
]

export function EnquiryForm() {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget
    const data = new FormData(form)

    const name = data.get("name")?.toString() || ""
    const phone = data.get("phone")?.toString() || ""
    const projectType = data.get("projectType")?.toString() || ""

    const message = `New Enquiry

Name: ${name}
Phone: ${phone}
Project Type: ${projectType}`

    const whatsappNumber = "919437797979"

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`

    window.open(whatsappUrl, "_blank")

    form.reset()
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate={false}
      className="
        flex
        w-full
        max-w-full
        flex-col
        gap-6
        sm:gap-7
        md:gap-8
      "
    >
      {/* Name */}
      <Field
        label="Name"
        name="name"
        type="text"
        required
        autoComplete="name"
      />

      {/* Phone */}
      <Field
        label="Phone"
        name="phone"
        type="tel"
        required
        autoComplete="tel"
      />

      {/* Project Type */}
      <div className="flex w-full flex-col gap-2.5 sm:gap-3">
        <label
          htmlFor="projectType"
          className="
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-stone-dim
            sm:text-xs
          "
        >
          Project Type
        </label>

        <select
          id="projectType"
          name="projectType"
          defaultValue=""
          required
          className="
            min-h-12
            w-full
            appearance-none
            rounded-none
            border-b
            border-gold/25
            bg-transparent
            py-3
            pr-8
            text-sm
            text-ivory
            outline-none
            transition-colors
            focus:border-gold
            sm:text-base
            [&>option]:bg-charcoal
          "
        >
          <option value="" disabled>
            Select a project type
          </option>

          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="
          mt-1
          flex
          min-h-12
          w-full
          items-center
          justify-center
          border
          border-gold
          px-6
          py-3.5
          text-[10px]
          uppercase
          tracking-[0.18em]
          text-ivory
          transition-all
          duration-300
          hover:bg-gold
          hover:text-background
          focus:outline-none
          focus:ring-1
          focus:ring-gold
          focus:ring-offset-2
          focus:ring-offset-background
          sm:mt-2
          sm:w-fit
          sm:min-w-45
          sm:px-8
          sm:py-4
          sm:text-xs
        "
      >
        Send Enquiry
      </button>
    </form>
  )
}

function Field({
  label,
  name,
  type,
  required,
  autoComplete,
}: {
  label: string
  name: string
  type: string
  required?: boolean
  autoComplete?: string
}) {
  return (
    <div className="flex w-full flex-col gap-2.5 sm:gap-3">
      <label
        htmlFor={name}
        className="
          text-[10px]
          uppercase
          tracking-[0.18em]
          text-stone-dim
          sm:text-xs
        "
      >
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="
          min-h-12
          w-full
          rounded-none
          border-0
          border-b
          border-gold/25
          bg-transparent
          px-0
          py-3
          text-sm
          text-ivory
          outline-none
          transition-colors
          placeholder:text-stone-dim
          focus:border-gold
          sm:text-base
        "
      />
    </div>
  )
}

