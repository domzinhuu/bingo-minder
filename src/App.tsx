import { BingoCard } from "./components/bingo-card";
import { generateBingoCard } from "./utils/functions";

function App() {
  const cardNumbers = generateBingoCard();
  return (
    <div className="h-screen max-w-[1280px] w-full mx-auto pt-16">
      
      <div className="w-full flex justify-center items-end">
        <BingoCard cardNumbers={cardNumbers} />
      </div>
    </div>
  );
}

export default App;
