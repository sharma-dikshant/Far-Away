import { useState } from "react";

export default function App() {
  const [items, setItems] = useState([]);
  function handleAddItems(item) {
    // here we can't update the state is items.push(). Because it will mutate the state and in react it is not allowed.
    // so we have to return a new array
    setItems((prevItems) => {
      return [...prevItems, item];
    });
  }

  function handleDeleteItems(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  function handleTogglePackedItem(id) {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }

  function handleClearItems() {
    setItems([]);
  }

  // so the we want to call this function when we press the cross button
  // the cross button is in PackingList>Item
  // so we have to pass this function as a prop to the PackingList component and from PackingList to Items

  return (
    <div className="app">
      <Logo />
      <Form onHandleAddItems={handleAddItems} />
      <PackingList
        items={items}
        onDeleteItems={handleDeleteItems}
        onHandleTogglePackedItem={handleTogglePackedItem}
        onHandleClearItems={handleClearItems}
      />
      <Stats items={items} />
    </div>
  );
}

function Logo() {
  return <h1>Far Awaay</h1>;
}

function Form(props) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(evt) {
    evt.preventDefault();

    if (!description) return;
    const newItem = {
      description,
      quantity,
      packed: false,
      id: Date.now(),
    };
    props.onHandleAddItems(newItem);

    console.log(newItem);
    setDescription("");
    setQuantity(1);
  }
  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h3>What do you need for your trip</h3>
      <select
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      >
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></input>
      <button>Add</button>
    </form>
  );
}

function PackingList(props) {
  const [sortBy, setSortBy] = useState("input");

  let sortedItems;
  if (sortBy === "input") sortedItems = props.items;

  if (sortBy === "description")
    sortedItems = props.items
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));

  if (sortBy === "packed")
    sortedItems = props.items
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item
            item={item}
            key={item.id}
            onDeleteItems={props.onDeleteItems}
            onHandleTogglePackedItem={props.onHandleTogglePackedItem}
          />
        ))}
      </ul>
      <div className="actions">
        <select value={sortBy} onChange={(evt) => setSortBy(evt.target.value)}>
          <option value="input">Sort by input order</option>
          <option value="packed">Sort by packed</option>
          <option value="description">Sort by description</option>
        </select>
        <button onClick={props.onHandleClearItems}>Clear List</button>
      </div>
    </div>
  );
}

function Item(props) {
  return (
    <li>
      <input
        type="checkbox"
        value={props.item.packed}
        onChange={() => props.onHandleTogglePackedItem(props.item.id)}
      ></input>
      <span style={props.item.packed ? { textDecoration: "line-through" } : {}}>
        {props.item.quantity} {props.item.description}{" "}
      </span>
      <button onClick={() => props.onDeleteItems(props.item.id)}>❌</button>
    </li>
  );
}

function Stats({ items }) {
  const totalItems = items.length;
  const totalPackedItems = items.filter((item) => item.packed).length;
  const PercentCompleted = Math.round((totalPackedItems / totalItems) * 100);
  return (
    <footer>
      {items.length === 0
        ? "No Items in List.."
        : PercentCompleted === 100
        ? "You are all packed!"
        : `You have ${totalItems} items on your list. ${totalPackedItems} were already packed (${PercentCompleted}%)`}
    </footer>
  );
}
