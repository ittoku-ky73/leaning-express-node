/*
 * ref: https://github.com/prisma/prisma-examples/blob/latest/javascript/script/script.js
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function main() {
  const author1 = await prisma.author.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'hoge bar',
      birthDate: new Date('1234', '5', '6'),
      deathDate: new Date('2345', '6', '7')
    }
  });

  const book1 = await prisma.book.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'prisma on express',
      summary: 'this is tutorial summary',
      ISBN: 'abcdefg',
      authorId: author1.id,
    }
  });

  const bookInstance1 = await prisma.bookInstance.upsert({
    where: { id: 1 },
    update: {},
    create: {
      imprint: 'nanndemonaiyo',
      status: 'AVAILABLE',
    }
  });

  const genre1 = await prisma.genre.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'IT',
    }
  });
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });
