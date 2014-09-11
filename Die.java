public class Die implements MoveGadget{
	private int sides;
	private int value; 

	public static void main(String[] args) { 
	}

		public Die(int sides){
		if ((sides < 2 ) || (sides % 1 != 0)) {
			throw new IllegalArgumentException();
		}
		else{
		this.sides = sides;
		this.value = ((int) (Math.floor((Math.random() * this.sides) + 1)));
		}	
	}

	/**Choose a random number to determine value of a roll**/
	public int randomizeValue(){
		this.value = (int) (Math.floor((Math.random() * this.sides)+ 1));
		return this.value;
	}

	/**Returns the current value of the die**/
	public int getValue(){
		return this.value;
	}

	/**Sets the value of the die to a specified value. Must be less than or equal to the number of sids on the die.**/
	public void setValue(int value){
		if ((value < 1 ) || (value % 1 != 0) || (value > getSides())) {
			throw new IllegalArgumentException();
		}else{
		this.value = value;
		}
	}

	/**Returns the highest value the die can roll**/
	public int maxValue(){
		return value;
	}

	/**Returns a string representation of the die**/
	public String toString(){
		String dieString = "";

		dieString += value;

		return dieString;
	}


	/**Returns the number of sides on the die**/
	public int getSides(){
		return this.sides;
	}
}