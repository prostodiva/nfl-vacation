import Button from "./Button";
import Input from "./Input";

function Hero() {

const handleClick = () => {
    console.log("Button clicked!");
}

    return (
        <div>
            <h1>Hero Section: Reusable components test</h1>
            <Input />
            <Button 
                primary
                rounded
                onClick={handleClick}
            >
                List all Teams
            </Button>
        </div>
        
    );
}

export default Hero;