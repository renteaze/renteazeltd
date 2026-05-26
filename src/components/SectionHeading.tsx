interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeading = ({ title, subtitle, centered = true, className = "" }: SectionHeadingProps) => (
  <div className={`mb-10 ${centered ? "text-center" : ""} ${className}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-foreground">{title}</h2>
    {subtitle && (
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto text-lg">{subtitle}</p>
    )}
    <div className={`mt-4 h-1 w-16 bg-accent rounded ${centered ? "mx-auto" : ""}`} />
  </div>
);

export default SectionHeading;
