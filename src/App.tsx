import { useState } from 'react';
import { initialTravelPlan } from './places';

interface Place {
  id: number;
  title: string;
  childIds: number[];
}

interface TravelPlanState {
  [key: number]: Place;
}

interface PlaceTreeProps {
  id: number;
  parentId: number;
  placesById: TravelPlanState;
  onComplete: (parentId: number, childId: number) => void;
}

export default function TravelPlan() {
  const [plan, setPlan] = useState<TravelPlanState>(initialTravelPlan);

  function handleComplete(parentId: number, childId: number): void {
    const parent = plan[parentId];
    const nextParent: Place = {
      ...parent,
      childIds: parent.childIds
      .filter((id) => id !== childId),
    };
    setPlan({
      ...plan,
      [parentId]: nextParent,
    });
  }

  const root = plan[0];
  const planetIds = root.childIds;
  return (
    <>
      <h2>Places to visit</h2>
      <ol>
        {planetIds.map((id) => (
          <PlaceTree
            key={id}
            id={id}
            parentId={0}
            placesById={plan}
            onComplete={handleComplete}
          />
        ))}
      </ol>
    </>
  );
}

function PlaceTree({ id, parentId, placesById, onComplete }: PlaceTreeProps) {
  const place = placesById[id];
  const childIds = place.childIds;
  return (
    <li>
      {place.title}
      <button onClick={() => onComplete(parentId, id)}>Complete</button>
      {childIds.length > 0 && (
        <ol>
          {childIds.map((childId) => (
            <PlaceTree
              key={childId}
              id={childId}
              parentId={id}
              placesById={placesById}
              onComplete={onComplete}
            />
          ))}
        </ol>
      )}
    </li>
  );
}
