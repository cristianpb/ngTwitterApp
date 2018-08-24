from dataclasses import dataclass
from typing import List


@dataclass
class Actor:
    name: str
    age: int


@dataclass
class Film:
    name: str
    actors: List[Actor]


actor = Actor("Stan", 29)
film = Film("?", [actor, '3'])

print(actor.age)
