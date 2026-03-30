@import "tailwindcss";

@theme {
  --dark: class;
}

@variant dark (&:where(.dark, .dark *));
