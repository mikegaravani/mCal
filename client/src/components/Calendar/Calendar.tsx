import CalComponent from "./CalComponent";
import AddEventDialog from "./AddEventDialog";

function Calendar() {
  return (
    <>
      <div className="p-6">
        <CalComponent />
        <AddEventDialog />
      </div>
    </>
  );
}

export default Calendar;
