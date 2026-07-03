# Demo Walkthrough

1. Start the local stack with Docker Compose.
2. Run the RabbitMQ setup script to initialize demo queues.
3. Execute the end-to-end demo test to publish sample events.
4. Review service logs for HL7 parsing, FHIR mapping, risk prediction, and orchestration outputs.
5. Open the dashboard to inspect synthetic population-health and care-gap views.

```bash
docker compose up -d
python setup_rabbitmq.py
python demo_end_to_end_test.py
```

If Docker or RabbitMQ are unavailable, run `docker compose config` as a lightweight validation of the service graph.

