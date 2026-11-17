import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { RecipePage } from "@/components/RecipePage";
import { recipePages, recipePath, photosWithRecipe } from "@/data/looks";
import { coverPhoto } from "@/data/photos";

// One page per recipe that has one (src/data/looks.ts), pre-rendered; any other path is
// a 404. Strangers search for a recipe by name, so the title leads with it.
export const dynamicParams = false;

export function generateStaticParams() {
  return recipePages.map((r) => ({ recipe: r.id }));
}

type Params = Promise<{ recipe: string }>;

async function resolveRecipe(params: Params) {
  const { recipe: id } = await params;
  const recipe = recipePages.find((r) => r.id === id);
  if (!recipe) notFound();
  return recipe;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const recipe = await resolveRecipe(params);
  const list = photosWithRecipe(recipe.id);
  const cover = coverPhoto(list);
  const title = `${recipe.name} · Fujifilm recipe · Mihail Kovashki`;
  const description = `The ${recipe.name} film simulation recipe (${recipe.filmSimulation}${recipe.source ? `, from ${recipe.source}` : ""}): its settings as dials, and ${list.length} photos shot with it straight out of camera.`;
  return {
    title,
    description,
    alternates: { canonical: recipePath(recipe.id) },
    openGraph: {
      title,
      description,
      type: "article",
      url: recipePath(recipe.id),
      images: cover ? [{ url: cover.displayUrl, width: cover.width, height: cover.height, alt: recipe.name }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function Page({ params }: { params: Params }) {
  const recipe = await resolveRecipe(params);
  return <RecipePage recipeId={recipe.id} />;
}
