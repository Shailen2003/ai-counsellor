import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Starting database seed...');

    // Read universities data
    const universitiesPath = path.join(process.cwd(), 'data', 'universities.json');
    console.log('Reading universities.json from:', universitiesPath);
    const universitiesData = JSON.parse(fs.readFileSync(universitiesPath, 'utf-8'));
    console.log(`Successfully read ${universitiesData.length} universities from JSON`);

    // Seed universities
    console.log('Connecting to database...');
    console.log('Seeding universities...');
    for (const uni of universitiesData) {
        await prisma.university.upsert({
            where: { id: uni.id },
            update: {},
            create: {
                id: uni.id,
                name: uni.name,
                country: uni.country,
                city: uni.city,
                ranking: uni.ranking,
                programs: uni.programs,
                minGPA: uni.minGPA,
                minIELTS: uni.minIELTS,
                minGRE: uni.minGRE,
                tuitionMin: uni.tuitionMin,
                tuitionMax: uni.tuitionMax,
                livingCost: uni.livingCost,
                acceptanceRate: uni.acceptanceRate,
                website: uni.website,
                description: uni.description,
            },
        });
    }

    console.log(`Seeded ${universitiesData.length} universities`);
    console.log('Database seed completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
