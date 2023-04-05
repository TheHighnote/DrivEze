const client = require("./index");
//create a guest user
async function createGuest(name)
{
    try
    {
        await client.connect();
        const{
            rows:[guest]
        } = await client.query(`
            INSERT INTO guests (name)
            VALUES($1)
            RETURNING id, name;
        `, [name]);
        await client.release();

        await createGuestCart(guest.id);

        return guest;
    }
    catch(e)
    {
        console.error("Error creating a guest");
        throw e;
    }
}

async function getGuestById(guestId)
{
    try
    {
        await client.connect();
        const
        {
            rows:[guest]
        } = await client.query(`
            SELECT *
            FROM guests
            WHERE id=$1;
        `, [guestId]);
        await client.release();
        return guest;
    }
    catch(e)
    {
        console.error(e);
        throw e;
    }
}

async function createGuestCart(guestId)
{
    try
    {
        await client.connect();
        const
        {
            rows:[guestCart]
        } = await client.query(`
            INSERT INTO guest_cart("guestId")
            VALUES($1)
            RETURNING *;
        `, [guestId]);
        await client.release();
        console.log(guestCart);
        return guestCart;
    }
    catch(e)
    {
        console.error("Error creating a guest cart");
        throw e;
    }
}

async function getCartByGuestId(guestId)
{
    try
    {
        await client.connect();
        const 
        {
            rows:[cart]
        } = await client.query(`
            SELECT guest_cart.id as "cartId"
            FROM guest_cart
            JOIN guests on guest_cart."guestId" = guests.id
            WHERE guests.id = $1;
        `,[guestId]);
        await client.release();
        return cart;
    }
    catch(e)
    {
        throw e;
    }
}

async function addCarToGuestCart(carId, cartId, price)
{
    console.log(carId, cartId, price);
    try
    {
        console.log("here")
        await client.connect();
        const
        {
            rows: [cartItem]
        } = await client.query(`
            INSERT INTO guest_cart_items("guestCartId", "carId", price)
            SELECT $1, $2, $3
            FROM cars
            WHERE cars.id=$2
            RETURNING *;
        `,[cartId, carId, price]);
        await client.release();
        console.log(cartItem)
        return cartItem;
    }
    catch(e)
    {
        throw e;
    }
}

module.exports = {
    createGuest,
    getGuestById,
    getCartByGuestId,
    addCarToGuestCart
}