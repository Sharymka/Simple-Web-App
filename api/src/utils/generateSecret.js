const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

const envFilePath = process.env.ENV_FILE_PATH || '.env';

console.log(`Путь к .env файлу: ${envFilePath}`);
const generateSecret = () => {
    return crypto.randomBytes(64).toString('hex');
};

const secretKey = generateSecret();

// Чтение существующего файла .env
fs.readFile(envFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
        console.error('Ошибка чтения .env файла:', err);
        return;
    }

    // Если файл не существует, создаём пустую строку
    const existingEnv = data || '';

    // Добавление или обновление переменной JWT_SECRET
    const envLines = existingEnv.split('\n');
    const newEnvLines = envLines.filter(line => !line.startsWith('JWT_SECRET='));
    newEnvLines.push(`JWT_SECRET=${secretKey}`);

    const newEnvContent = newEnvLines.join('\n');

    // Запись обновлённого содержимого в файл .env
    fs.writeFile(envFilePath, newEnvContent, (err) => {
        if (err) {
            console.error('Ошибка записи в .env файл:', err);
        } else {
            console.log('.env файл успешно обновлён с новым JWT_SECRET');
        }
    });
});
