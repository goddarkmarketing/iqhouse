<?php
declare(strict_types=1);

function iq_form_back(string $flag): void
{
    $next = (string) ($_POST['next'] ?? 'contact.html');
    $allowed = ['contact.html', 'index.html'];
    if (!in_array($next, $allowed, true)) {
        $next = 'contact.html';
    }
    header('Location: ' . $next . '?' . $flag . '#iqContactForm');
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: contact.html');
    exit;
}

if (trim((string) ($_POST['company_website'] ?? '')) !== '') {
    iq_form_back('sent=1');
}

$name = trim((string) ($_POST['name'] ?? ''));
$phone = trim((string) ($_POST['phone'] ?? ''));
$topic = trim((string) ($_POST['topic'] ?? ''));
$place = trim((string) ($_POST['place'] ?? ''));
$message = trim((string) ($_POST['message'] ?? ''));

$topics = ['ออกแบบบ้าน', 'ประเมินงบประมาณ', 'นัดสำรวจที่ดิน', 'ดูผลงาน', 'อื่นๆ'];
if (!in_array($topic, $topics, true)) {
    $topic = 'อื่นๆ';
}

$digits = preg_replace('/\D+/', '', $phone) ?? '';
if (mb_strlen($name) < 2 || mb_strlen($name) > 80 || strlen($digits) < 9 || mb_strlen($message) < 2) {
    iq_form_back('error=1');
}

$row = [
    'time' => date('c'),
    'name' => mb_substr($name, 0, 80),
    'phone' => mb_substr($phone, 0, 20),
    'topic' => $topic,
    'place' => mb_substr($place, 0, 120),
    'message' => mb_substr($message, 0, 2000),
];

$dir = __DIR__ . '/data';
if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
    iq_form_back('error=1');
}

$guard = $dir . '/.htaccess';
if (!is_file($guard)) {
    file_put_contents($guard, "Require all denied\n");
}

$encoded = json_encode($row, JSON_UNESCAPED_UNICODE);
if ($encoded === false || file_put_contents($dir . '/inquiries.jsonl', $encoded . "\n", FILE_APPEND | LOCK_EX) === false) {
    iq_form_back('error=1');
}

iq_form_back('sent=1');
