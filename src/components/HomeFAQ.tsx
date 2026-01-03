import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const HomeFAQ = () => {
  return (
    <section className="py-12 px-4 bg-muted/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about our learning programs
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-3">
          <AccordionItem value="item-1" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              How do I access a course or workshop?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Simply browse our program catalog and click on any course, workshop, or event that interests you. 
              From there, you can enroll directly or register for upcoming live sessions. 
              You'll receive immediate access to self-paced content or confirmation details for scheduled events.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              What types of learning formats are available?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              We offer multiple learning formats to fit your schedule and learning style: 
              self-paced online courses, interactive workshops, live trainings, virtual summits with industry experts, 
              in-person events, and masterclasses. Each format is designed to provide actionable business knowledge.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              Are the programs suitable for beginners?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Absolutely! Our programs cater to all experience levels. Whether you're just starting your 
              entrepreneurial journey or looking to scale an existing business, you'll find content 
              appropriate for your stage. Each program clearly indicates the recommended experience level.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              Do I get a certificate upon completion?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Yes! Upon completing a course or program, you'll receive a digital certificate of completion 
              that you can share on LinkedIn or add to your professional portfolio. Some advanced programs 
              also include industry-recognized certifications.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5" className="bg-card rounded-lg px-5 border-border shadow-sm">
            <AccordionTrigger className="text-left hover:no-underline text-sm font-medium">
              Can I get personalized guidance on which program to take?
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground text-sm">
              Yes! Schedule a free consultation with our learning advisors. They'll help you identify 
              your business goals, assess your current skills, and recommend the perfect learning path 
              tailored to your needs.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  );
};
