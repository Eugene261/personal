export default function Stats({ data }: { data?: Array<{ label: string, value: string }> }) {
    const displayStats = data || [
        { label: "Projects Shipped", value: "20+" },
        { label: "Technologies", value: "15+" },
        { label: "Lines of Code", value: "100K+" },
        { label: "AI Integrations", value: "10+" },
    ];

    return (
        <section className="py-20 px-6 border-y border-neutral-200/50 bg-neutral-50/50">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                {displayStats.map((stat) => (
                    <div key={stat.label} className="group flex flex-col items-center text-center">
                        <span className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-105 transition-transform tracking-tight">
                            {stat.value}
                        </span>
                        <span className="text-sm font-medium text-neutral-500 uppercase tracking-widest">
                            {stat.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
