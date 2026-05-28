
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const universities = await prisma.university.findMany();
    console.log('Total Universities:', universities.length);

    const nullNames = universities.filter(u => !u.name);
    const nullLocations = universities.filter(u => !u.city && !u.country);

    console.log('Universities with null names:', nullNames.length);
    console.log('Universities with null locations (city & country):', nullLocations.length);

    if (nullNames.length > 0) {
        console.log('Sample null name university:', nullNames[0]);
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
