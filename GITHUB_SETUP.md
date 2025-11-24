# Setup GitHub Repository

Dopo aver creato la repository `settimo-rent-excellence` su GitHub, esegui questi comandi:

```bash
cd C:\Users\aless\settimo-rent-excellence

# Aggiungi il remote (sostituisci USERNAME con il tuo username GitHub)
git remote add origin https://github.com/USERNAME/settimo-rent-excellence.git

# Aggiungi tutti i file
git add .

# Commit iniziale
git commit -m "Initial commit: Rent4Business Excellence - Next.js 15 project"

# Push su GitHub
git branch -M main
git push -u origin main
```

## Note

- Il file `scripts/generate-vehicles.js` è escluso dal commit (già in .gitignore)
- Il file `data/vehicles.json` con 218 veicoli sarà incluso nel commit
- Tutti i file di build (`.next/`) sono esclusi

