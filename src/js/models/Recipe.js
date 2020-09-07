import axios from 'axios';

export default class Recipe{
    constructor(id) {
        this.id=id;
    }
    async getRecipe(){
        try{
            const res=await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            //console.log(res);
            this.title=res.data.recipe.title;
            this.author=res.data.recipe.publisher;
            this.img=res.data.recipe.image_url;
            this.url=res.data.recipe.source_url;
            this.ingredients=res.data.recipe.ingredients;

            //console.log(this.title);
        }catch(error){
            alert(error);
        }
    }
    calcTime(){
        //Assume we need 15mins for 3 ingredients
        const numIng=this.ingredients.length;
        const periods=Math.ceil(numIng/3);
        this.time=periods*15;
    }
    calcServings(){
        this.servings=4;
    }
    parseIngredients(){
        const unitLong=['tablespoons', 'tablespoon', 'ounces', 'ounce', 'cups', 'cup', 'teaspoons', 'teaspoon', 'pounds'];
        const unitShort=['tbsp', 'tbsp', 'oz', 'oz', 'cup', 'cups', 'tsp', 'tsp', 'pound'];
        const units=[...unitShort, 'kg', 'g'];
        const newIngredients=this.ingredients.map(el=>{
            //1) Uniform units
            let ingredient=el.toLowerCase();
            unitLong.forEach((unit, i)=>{
                ingredient=ingredient.replace(unit, unitShort[i]);
            });

            //2)Remove parenthesis
            ingredient=ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3)Parse ingredient into count, unit and ingredient
            const arrIng=ingredient.split(' ');
            const unitIndex=arrIng.findIndex(el2=>units.includes(el2));
            let objIng;
            if(unitIndex>-1){
                //there is unit
                let count;
                const arrCount=arrIng.slice(0, unitIndex);
                if(arrCount.length===1){
                    count=eval(arrIng[0].replace('-', '+'));
                }
                else{
                    count=eval(arrIng.slice(0, unitIndex).join('+'));
                }
                objIng={
                    count, 
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' '),
                }
            }
            else if(parseInt(arrIng[0], 10)){
                //there is no unit but 1st element is a number
                objIng={
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient:arrIng.slice(1).join(' '),
                }
            }
            else if(unitIndex===-1){
                //there is no unit and no number in 1st position
                objIng={
                    count: 1,
                    unit: '',
                    ingredient,
                }
            }
            return objIng;
        });
        this.ingredients=newIngredients;
    }
    updateServings(type){
        //Servings
        const newServings= type==='dec'?this.servings-1:this.servings+1;
        //Ingredients
        this.ingredients.forEach(ing=>{
            ing.count*=(newServings/this.servings);
        });
        this.servings=newServings;
    }
}
