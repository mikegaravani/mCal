import CalComponent from "./CalComponent";
import AddEventDialog from "./AddEventDialog";
import AddTaskDialog from "./AddTaskDialog";

function Calendar() {
  return (
    <>
      <div className="p-6">
        <CalComponent />
        <AddEventDialog />
        <AddTaskDialog />
      </div>
    </>
  );
}

export default Calendar;
