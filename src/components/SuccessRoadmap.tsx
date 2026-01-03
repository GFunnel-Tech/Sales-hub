export const SuccessRoadmap = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto bg-card rounded-lg p-8 shadow-lg border border-border">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">90-Day Success Roadmap</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                30
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Days 1-30</h3>
              <p className="text-sm text-muted-foreground">Campaign launch, initial testing, audience refinement</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary/10 text-secondary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                60
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Days 31-60</h3>
              <p className="text-sm text-muted-foreground">Optimization, scale winning ads, expand reach</p>
            </div>
            <div className="text-center">
              <div className="bg-accent/10 text-accent rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                90
              </div>
              <h3 className="font-semibold mb-2 text-foreground">Days 61-90</h3>
              <p className="text-sm text-muted-foreground">Peak performance, predictable lead flow, scaling decisions</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
