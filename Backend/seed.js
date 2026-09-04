import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config({ path: './Backend/.env' });
dotenv.config();
import connectDB from './config/mongodb.js';
import productModel from './models/productModel.js';
import { productsData } from './data/productsData.js';

const seedDB = async () => {
    try {
        await connectDB();
        console.log("Connected to MongoDB for Seeding...");

        await productModel.deleteMany({});
        console.log("Cleared existing products.");

        const inserted = await productModel.insertMany(productsData);
        console.log(`Successfully seeded ${inserted.length} real food items into the database!`);
        console.log("\n=== IMAGE AUDIT SUMMARY ===");
        inserted.forEach(p => console.log(`✓ ${p.title.padEnd(45)} → ${p.img[0].substring(0, 70)}...`));

        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
