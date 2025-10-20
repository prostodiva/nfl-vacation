import Button from "./Button";
import Input from "./Input";

function Hero() {
    return (
        <div>
            <h1>Reusable components test</h1>
            <Input />
            <Button 
                primary
                rounded
                onClick={() => alert('Button clicked!')}
            >
                Submit
            </Button>
        </div>
        
    );
}

export default Hero;