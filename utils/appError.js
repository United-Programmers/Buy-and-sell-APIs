// I have 2 class name here one call <[AppError]> an the other one call <[Error]>
//Note: The <[Error]> class name get a parameter of [message]
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;




















//! JAVASCRIPT CLASS REVISION 
//===========================
//*class one [Car]
class Car {
    constructor(brand) {
        //assigning the brand of a car to => this.car_name
        this.car_name = brand;
    }

    //This is a func that return the result 
    present() {
        return "result is" + this.car_name
    }
}

//* I could disp this class here but i extend it in class two
// my_car = new Car("Ford");
// console.log(my_car);


//*Class two [Model]
class Model extends Car {
    constructor(brand, mod) {
        super(brand); //super pass a val to class Car constructor
        this.mod = mod;
    }
    display() {
        return this.present() + ', it is a ' + this.model;
    }
}

//*am passing 2 val one that goes to class Car constructor and the second one to Class Model constructor
my_car = new Model("Ford", "Mustang");
// console.log(my_car);