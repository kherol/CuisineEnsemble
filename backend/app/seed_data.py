from datetime import datetime, timedelta

from app.core.security import get_password_hash
from app.database import Base, SessionLocal, engine
from app.models import Meal, User


def get_or_create_host(db, name, email, district, dietary_preferences=None, allergies=None):
    user = db.query(User).filter(User.email == email).first()

    if user:
        return user

    user = User(
        name=name,
        email=email,
        hashed_password=get_password_hash("password123"),
        district=district,
        dietary_preferences=dietary_preferences,
        allergies=allergies,
        role="user",
        is_active=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def create_meal_if_not_exists(
    db,
    host,
    title,
    description,
    days_from_now,
    hour,
    location,
    district,
    total_places,
    price_per_person,
    allergens,
    dietary_tags,
    image_url=None,
):
    existing_meal = db.query(Meal).filter(Meal.title == title).first()

    if existing_meal:
        return existing_meal

    meal_datetime = datetime.utcnow() + timedelta(days=days_from_now)
    meal_datetime = meal_datetime.replace(hour=hour, minute=0, second=0, microsecond=0)

    meal = Meal(
        host_id=host.id,
        title=title,
        description=description,
        meal_datetime=meal_datetime,
        location=location,
        district=district,
        total_places=total_places,
        remaining_places=total_places,
        price_per_person=price_per_person,
        allergens=allergens,
        dietary_tags=dietary_tags,
        image_url=image_url,
        status="open",
    )

    db.add(meal)
    db.commit()
    db.refresh(meal)

    return meal


def seed():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        host_1 = get_or_create_host(
            db,
            name="Aïcha Cuisine",
            email="aicha.host@cuisineensemble.test",
            district="Centre-ville",
            dietary_preferences="Halal, Sans porc",
            allergies="",
        )

        host_2 = get_or_create_host(
            db,
            name="Mamie Louise",
            email="louise.host@cuisineensemble.test",
            district="La Source",
            dietary_preferences="Cuisine familiale",
            allergies="",
        )

        host_3 = get_or_create_host(
            db,
            name="Karim Saveurs",
            email="karim.host@cuisineensemble.test",
            district="Madeleine",
            dietary_preferences="Halal",
            allergies="",
        )

        host_4 = get_or_create_host(
            db,
            name="Sarah Veggie",
            email="sarah.host@cuisineensemble.test",
            district="Dunois",
            dietary_preferences="Végétarien",
            allergies="",
        )

        meals = [
            {
                "host": host_1,
                "title": "Couscous maison aux légumes",
                "description": "Un couscous généreux avec légumes, pois chiches et semoule. Repas convivial pour découvrir une cuisine familiale et chaleureuse.",
                "days_from_now": 1,
                "hour": 19,
                "location": "Rue de Bourgogne, Orléans",
                "district": "Centre-ville",
                "total_places": 6,
                "price_per_person": 6.50,
                "allergens": "Gluten",
                "dietary_tags": "Halal, Sans porc",
            },
            {
                "host": host_2,
                "title": "Gratin dauphinois et salade",
                "description": "Repas simple et réconfortant autour d’un gratin dauphinois maison accompagné d’une salade fraîche.",
                "days_from_now": 2,
                "hour": 20,
                "location": "Avenue de la Bolière, Orléans",
                "district": "La Source",
                "total_places": 4,
                "price_per_person": 4.00,
                "allergens": "Lait, Lactose",
                "dietary_tags": "Végétarien",
            },
            {
                "host": host_3,
                "title": "Poulet yassa et riz parfumé",
                "description": "Un plat ouest-africain à base de poulet mariné, oignons, citron et riz. Idéal pour partager un moment autour d’une cuisine épicée.",
                "days_from_now": 3,
                "hour": 19,
                "location": "Quartier Madeleine, Orléans",
                "district": "Madeleine",
                "total_places": 5,
                "price_per_person": 7.00,
                "allergens": "Moutarde possible",
                "dietary_tags": "Halal, Sans porc",
            },
            {
                "host": host_4,
                "title": "Curry végétarien au lait de coco",
                "description": "Curry doux avec légumes, pois chiches, lait de coco et riz. Une option végétarienne équilibrée et parfumée.",
                "days_from_now": 4,
                "hour": 18,
                "location": "Rue du Faubourg Bannier, Orléans",
                "district": "Dunois",
                "total_places": 6,
                "price_per_person": 5.50,
                "allergens": "Noix de coco",
                "dietary_tags": "Végétarien, Sans porc",
            },
            {
                "host": host_1,
                "title": "Tajine de légumes et semoule",
                "description": "Tajine de légumes mijotés aux épices douces, servi avec de la semoule. Repas adapté aux personnes qui souhaitent éviter la viande.",
                "days_from_now": 5,
                "hour": 20,
                "location": "Place du Martroi, Orléans",
                "district": "Centre-ville",
                "total_places": 5,
                "price_per_person": 5.00,
                "allergens": "Gluten",
                "dietary_tags": "Végétarien, Halal, Sans porc",
            },
            {
                "host": host_2,
                "title": "Pâtes maison sauce tomate basilic",
                "description": "Un repas simple, économique et convivial autour de pâtes maison avec sauce tomate basilic.",
                "days_from_now": 6,
                "hour": 19,
                "location": "Rue des Carmes, Orléans",
                "district": "Carmes",
                "total_places": 8,
                "price_per_person": 3.50,
                "allergens": "Gluten",
                "dietary_tags": "Végétarien, Sans porc",
            },
            {
                "host": host_3,
                "title": "Riz au gras béninois",
                "description": "Un plat inspiré de la cuisine béninoise avec riz parfumé, légumes et épices. Parfait pour découvrir une nouvelle cuisine.",
                "days_from_now": 7,
                "hour": 20,
                "location": "Boulevard Alexandre Martin, Orléans",
                "district": "Centre-ville",
                "total_places": 6,
                "price_per_person": 6.00,
                "allergens": "Aucun allergène majeur déclaré",
                "dietary_tags": "Halal, Sans porc",
            },
            {
                "host": host_4,
                "title": "Salade complète quinoa avocat",
                "description": "Repas frais et léger avec quinoa, avocat, légumes croquants et sauce maison. Idéal pour un déjeuner sain.",
                "days_from_now": 2,
                "hour": 12,
                "location": "Quartier Dunois, Orléans",
                "district": "Dunois",
                "total_places": 4,
                "price_per_person": 4.50,
                "allergens": "Sésame possible",
                "dietary_tags": "Végétarien, Sans gluten, Sans porc",
            },
        ]

        for meal_data in meals:
            host = meal_data.pop("host")
            create_meal_if_not_exists(db, host=host, **meal_data)

        print("Données de démonstration ajoutées avec succès.")
        print("Hôtes créés : Aïcha Cuisine, Mamie Louise, Karim Saveurs, Sarah Veggie")
        print("Repas disponibles créés dans la base de données.")

    finally:
        db.close()


if __name__ == "__main__":
    seed()