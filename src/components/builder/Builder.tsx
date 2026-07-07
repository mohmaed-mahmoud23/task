import { Accordion, AccordionItem } from "../../../src/components/ui/accordion"

export function Builder() {
  return (
    <div>
<Accordion>

  <AccordionItem value="cameras"> 
    Choose your cameras
  </AccordionItem>

  <AccordionItem value="plan">
    Choose your plan
  </AccordionItem>

  <AccordionItem value="sensors">
    Choose your sensors
  </AccordionItem>

  <AccordionItem value="protection">
    Add extra protection
  </AccordionItem>

</Accordion>    </div>
  )
}