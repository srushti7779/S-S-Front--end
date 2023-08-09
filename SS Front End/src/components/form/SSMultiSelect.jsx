import { useState } from "react";
import { Listbox } from "@headlessui/react";

const people = [
  { id: 1, name: "Durward Reynolds" },
  { id: 2, name: "Kenton Towne" },
  { id: 3, name: "Therese Wunsch" },
  { id: 4, name: "Benedict Kessler" },
  { id: 5, name: "Katelyn Rohan" },
];

const SSMultiSelcet = () => {
  const [selectedPeople, setSelectedPeople] = useState([]);

  return (
    <Listbox value={selectedPeople} onChange={setSelectedPeople} multiple>
      <Listbox.Button>
        {selectedPeople.map((person) => person.name).join(", ")}
      </Listbox.Button>
      <Listbox.Options>
        {people.map((person) => (
          <Listbox.Option key={person.id} value={person}>
            {person.name}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
};

export default SSMultiSelcet;
