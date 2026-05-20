import { seedDefaultCategories } from './seed'

seedDefaultCategories()
  .then(() => {
    console.log('Seed concluído com sucesso.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Erro ao executar seed:', error)
    process.exit(1)
  })
